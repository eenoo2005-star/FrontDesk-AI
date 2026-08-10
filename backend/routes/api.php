<?php

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Models\ConversationState;

/*
|--------------------------------------------------------------------------
| استقبال رسالة WhatsApp وحفظ العميل
|--------------------------------------------------------------------------
*/

Route::post('/incoming-message', function (Request $request) {
    $data = $request->validate([
        'customer_name' => ['required', 'string', 'max:255'],
        'customer_phone' => ['required', 'string', 'max:30'],
        'message_text' => ['required', 'string'],
        'message_id' => ['required', 'string'],
        'message_type' => ['required', 'string'],
        'phone_number_id' => ['required', 'string'],
    ]);

    $customer = Customer::updateOrCreate(
        [
            'phone' => $data['customer_phone'],
        ],
        [
            'name' => $data['customer_name'],
        ]
    );

    $conversationState = ConversationState::query()
    ->where('customer_id', $customer->id)
    ->first();

if (
    $conversationState &&
    $conversationState->expires_at &&
    $conversationState->expires_at->isPast()
) {
    $conversationState->delete();
    $conversationState = null;
}

    return response()->json([
        'success' => true,

        'message' => $customer->wasRecentlyCreated
            ? 'Customer created successfully'
            : 'Customer already exists and was updated',

        'customer' => [
            'id' => $customer->id,
            'name' => $customer->name,
            'phone' => $customer->phone,
        ],

        'incoming_message' => [
            'text' => $data['message_text'],
            'type' => $data['message_type'],
            'message_id' => $data['message_id'],
        ],

        'conversation_state' => $conversationState
    ? [
        'intent' => $conversationState->intent,
        'service_name' => $conversationState->service_name,
       'requested_date' => $conversationState->requested_date
    ? Carbon::parse($conversationState->requested_date)->format('Y-m-d')
    : null,
        'requested_time' => $conversationState->requested_time,
        'waiting_for' => $conversationState->waiting_for,
        'context' => $conversationState->context,
        'expires_at' => $conversationState->expires_at?->toIso8601String(),
    ]
    : null,

        'next_action' => 'classify_intent',
    ]);
});

/*
|--------------------------------------------------------------------------
| معالجة نية العميل وتنفيذ الحجز
|--------------------------------------------------------------------------
*/

Route::post('/process-intent', function (Request $request) {
    $data = $request->validate([
        'customer_id' => [
            'required',
            'integer',
            'exists:customers,id',
        ],

        'intent' => [
            'required',
            'string',
            'in:book_appointment,reschedule_appointment,cancel_appointment,faq,unknown',
        ],

        'language' => [
    'required',
    'string',
    'in:ar,en',
],

        'service_name' => [
            'nullable',
            'string',
            'max:255',
        ],

        'requested_date' => [
            'nullable',
            'date_format:Y-m-d',
        ],

        'requested_time' => [
            'nullable',
            'date_format:H:i',
        ],

        'message_text' => [
            'required',
            'string',
        ],
    ]);
        $language = $data['language'] ?? 'ar';
    $isEnglish = $language === 'en';

    /*
    |--------------------------------------------------------------------------
    | 1. تحميل ذاكرة المحادثة الحالية
    |--------------------------------------------------------------------------
    */

    $state = ConversationState::query()
        ->where('customer_id', $data['customer_id'])
        ->first();

    if (
        $state &&
        $state->expires_at &&
        $state->expires_at->isPast()
    ) {
        $state->delete();
        $state = null;
    }

    /*
    |--------------------------------------------------------------------------
    | 2. دمج الرسالة الحالية مع المعلومات القديمة
    |--------------------------------------------------------------------------
    |
    | مثال:
    | الحالة القديمة تعرف أن العميل يريد تنظيف أسنان غداً الساعة الرابعة.
    | الرسالة الجديدة فقط: "مساءً"
    |
    | Ollama سيستخرج الوقت، وLaravel سيحتفظ ببقية المعلومات القديمة.
    */

    $intent = $data['intent'];

    if (
        $intent === 'unknown' &&
        $state &&
        $state->intent
    ) {
        $intent = $state->intent;
    }

    $serviceName = trim((string) ($data['service_name'] ?? ''));

    if (
        $serviceName === '' &&
        $state &&
        $state->service_name
    ) {
        $serviceName = $state->service_name;
    }

    $requestedDate = $data['requested_date'] ?? null;

    if (
        ! $requestedDate &&
        $state &&
        $state->requested_date
    ) {
      $requestedDate = Carbon::parse($state->requested_date)->format('Y-m-d');
    }

    $requestedTime = $data['requested_time'] ?? null;

    if (
        ! $requestedTime &&
        $state &&
        $state->requested_time
    ) {
        $requestedTime = $state->requested_time;
    }

    /*
|--------------------------------------------------------------------------
| منع الذكاء الاصطناعي من تخمين صباح / مساء
|--------------------------------------------------------------------------
|
| مثال:
| "الساعة الرابعة"          => وقت غامض => requested_time = null
| "الساعة الرابعة مساءً"   => واضح
| "الساعة الرابعة صباحًا"  => واضح
| "الساعة 16:00"           => واضح لأنه بنظام 24 ساعة
|
*/

$currentMessage = mb_strtolower(
    trim($data['message_text'])
);

$hasExplicitDayPart = preg_match(
    '/(صباح|صباحا|صباحًا|مساء|مساءا|مساءً|ظهر|ظهرا|ظهرًا|ليل|ليلا|ليلاً|فجر|الفجر|\bam\b|\bpm\b)/iu',
    $currentMessage
) === 1;

$hasAmbiguousClockPhrase =
    preg_match(
        '/(?:الساعة|الساعه)\s*(?:الواحدة|الواحده|الأولى|الاولى|الثانية|الثانيه|الثالثة|الثالثه|الرابعة|الرابعه|الخامسة|الخامسه|السادسة|السادسه|السابعة|السابعه|الثامنة|الثامنه|التاسعة|التاسعه|العاشرة|العاشره|الحادية\s*عشرة|الحاديه\s*عشره|الثانية\s*عشرة|الثانيه\s*عشره|0?[1-9]|1[0-2])(?=\s|$|[^\p{L}\p{N}_])/u',
        $currentMessage
    ) === 1
    ||
    preg_match(
        '/\b(?:at\s+)?(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|0?[1-9]|1[0-2])(?:\s*:\s*[0-5][0-9])?\b/i',
        $currentMessage
    ) === 1;

/*
 * حتى لو Ollama أعاد 04:00 أو 16:00،
 * Laravel يرفض التخمين.
 */
if (
    $requestedTime &&
    $hasAmbiguousClockPhrase &&
    ! $hasExplicitDayPart
) {
    $requestedTime = null;
}

    /*
    |--------------------------------------------------------------------------
    | 3. Context داخلي للمحادثة
    |--------------------------------------------------------------------------
    */

    $context = $state?->context ?? [];

    if (! isset($context['original_message'])) {
        $context['original_message'] = $data['message_text'];
    }

    $context['last_message'] = $data['message_text'];

    /*
    |--------------------------------------------------------------------------
    | 4. في الـMVP نعالج book_appointment فقط
    |--------------------------------------------------------------------------
    */

    if ($intent !== 'book_appointment') {
        return response()->json([
            'success' => true,
            'booked' => false,
            'action' => 'intent_not_implemented',
            'intent' => $intent,
            'reply' => 'تم فهم طلبك، لكننا نختبر حاليًا وظيفة حجز موعد جديد فقط.',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 5. الخدمة ناقصة
    |--------------------------------------------------------------------------
    */

    if ($serviceName === '') {
        ConversationState::updateOrCreate(
            [
                'customer_id' => $data['customer_id'],
            ],
            [
                'intent' => 'book_appointment',
                'service_name' => null,
                'requested_date' => $requestedDate,
                'requested_time' => $requestedTime,
                'waiting_for' => 'service_name',
                'context' => $context,
                'expires_at' => now()->addMinutes(30),
            ]
        );

        return response()->json([
            'success' => true,
            'booked' => false,
            'action' => 'needs_service',
            'waiting_for' => 'service_name',
'reply' => $isEnglish
    ? 'Which service would you like to book?'
    : 'ما الخدمة التي ترغب في حجزها؟',        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 6. البحث عن الخدمة
    |--------------------------------------------------------------------------
    */

    $service = Service::query()
        ->where('is_active', true)
        ->where('name', $serviceName)
        ->first();

    if (! $service) {
        ConversationState::updateOrCreate(
            [
                'customer_id' => $data['customer_id'],
            ],
            [
                'intent' => 'book_appointment',
                'service_name' => null,
                'requested_date' => $requestedDate,
                'requested_time' => $requestedTime,
                'waiting_for' => 'service_name',
                'context' => $context,
                'expires_at' => now()->addMinutes(30),
            ]
        );

        return response()->json([
            'success' => true,
            'booked' => false,
            'action' => 'service_not_found',
            'waiting_for' => 'service_name',
'reply' => $isEnglish
    ? 'Sorry, I could not find that service. Which service would you like?'
    : "عذرًا، لم أجد خدمة باسم {$serviceName}. ما الخدمة التي ترغب بها؟",        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 7. التاريخ ناقص
    |--------------------------------------------------------------------------
    */

    if (! $requestedDate) {
        ConversationState::updateOrCreate(
            [
                'customer_id' => $data['customer_id'],
            ],
            [
                'intent' => 'book_appointment',
                'service_name' => $service->name,
                'requested_date' => null,
                'requested_time' => $requestedTime,
                'waiting_for' => 'requested_date',
                'context' => $context,
                'expires_at' => now()->addMinutes(30),
            ]
        );

        return response()->json([
            'success' => true,
            'booked' => false,
            'action' => 'needs_date',
            'waiting_for' => 'requested_date',
            'service' => $service->name,
'reply' => $isEnglish
    ? 'Which day would you like to book your appointment?'
    : 'ما اليوم الذي يناسبك لحجز الموعد؟',        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 8. الوقت ناقص أو غامض
    |--------------------------------------------------------------------------
    */

    if (! $requestedTime) {
        ConversationState::updateOrCreate(
            [
                'customer_id' => $data['customer_id'],
            ],
            [
                'intent' => 'book_appointment',
                'service_name' => $service->name,
                'requested_date' => $requestedDate,
                'requested_time' => null,
                'waiting_for' => 'requested_time',
                'context' => $context,
                'expires_at' => now()->addMinutes(30),
            ]
        );

        return response()->json([
            'success' => true,
            'booked' => false,
            'action' => 'needs_time_clarification',
            'waiting_for' => 'requested_time',
            'service' => $service->name,
            'requested_date' => $requestedDate,
'reply' => $isEnglish
    ? 'Do you mean AM or PM?'
    : 'هل تقصد الوقت صباحًا أم مساءً؟',        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 9. تكوين وقت الموعد
    |--------------------------------------------------------------------------
    */

    $startsAt = Carbon::createFromFormat(
        'Y-m-d H:i',
        "{$requestedDate} {$requestedTime}",
        'Africa/Tripoli'
    );

    if ($startsAt->isPast()) {
        ConversationState::updateOrCreate(
            [
                'customer_id' => $data['customer_id'],
            ],
            [
                'intent' => 'book_appointment',
                'service_name' => $service->name,
                'requested_date' => null,
                'requested_time' => null,
                'waiting_for' => 'requested_date',
                'context' => $context,
                'expires_at' => now()->addMinutes(30),
            ]
        );

        return response()->json([
            'success' => true,
            'booked' => false,
            'action' => 'past_datetime',
            'waiting_for' => 'requested_date',
'reply' => $isEnglish
    ? 'That appointment time has already passed. What new date would you prefer?'
    : 'هذا الموعد في وقت مضى. ما التاريخ الجديد الذي يناسبك؟',        ]);
    }

    $endsAt = $startsAt
        ->copy()
        ->addMinutes($service->duration_minutes);

    /*
    |--------------------------------------------------------------------------
    | 10. فحص التعارض وإنشاء الموعد
    |--------------------------------------------------------------------------
    */

    $result = DB::transaction(function () use (
    $data,
    $service,
    $startsAt,
    $endsAt
) {
    $hasConflict = Appointment::query()
        ->whereIn('status', ['confirmed', 'pending'])
        ->where('starts_at', '<', $endsAt)
        ->where('ends_at', '>', $startsAt)
        ->exists();

    if ($hasConflict) {
        return [
            'conflict' => true,
            'appointment' => null,
        ];
    }

    $appointment = Appointment::create([
        'customer_id' => $data['customer_id'],
        'service_id' => $service->id,
        'starts_at' => $startsAt,
        'ends_at' => $endsAt,
        'status' => 'confirmed',
        'notes' => $data['message_text'],
    ]);

    return [
        'conflict' => false,
        'appointment' => $appointment,
    ];
});

/*
|--------------------------------------------------------------------------
| الموعد غير متاح
|--------------------------------------------------------------------------
*/

if ($result['conflict']) {
    ConversationState::updateOrCreate(
        [
            'customer_id' => $data['customer_id'],
        ],
        [
            'intent' => 'book_appointment',
            'service_name' => $service->name,
            'requested_date' => $requestedDate,
            'requested_time' => null,
            'waiting_for' => 'requested_time',
            'context' => $context,
            'expires_at' => now()->addMinutes(30),
        ]
    );

    return response()->json([
        'success' => true,
        'booked' => false,
        'action' => 'slot_unavailable',
        'waiting_for' => 'requested_time',
        'service' => $service->name,
        'requested_date' => $requestedDate,
        'requested_time' => $requestedTime,
'reply' => $isEnglish
    ? 'That time is unavailable. Please choose another time.'
    : 'هذا الموعد غير متاح. اختر وقتًا آخر من فضلك.',    ]);
}

/*
|--------------------------------------------------------------------------
| الحجز نجح
|--------------------------------------------------------------------------
*/

$appointment = $result['appointment'];

ConversationState::query()
    ->where('customer_id', $data['customer_id'])
    ->delete();

return response()->json([
    'success' => true,
    'booked' => true,
    'action' => 'appointment_confirmed',

    'appointment' => [
        'id' => $appointment->id,
        'customer_id' => $appointment->customer_id,
        'service_id' => $appointment->service_id,
        'service_name' => $service->name,
        'starts_at' => $appointment->starts_at->format('Y-m-d H:i'),
        'ends_at' => $appointment->ends_at->format('Y-m-d H:i'),
        'status' => $appointment->status,
    ],

    'reply' => $isEnglish
    ? sprintf(
        'Your %s appointment has been confirmed for %s at %s.',
        'Teeth Cleaning',
        $startsAt->format('Y-m-d'),
        $startsAt->format('H:i')
    )
    : sprintf(
        'تم تأكيد حجز %s بتاريخ %s في الساعة %s.',
        $service->name,
        $startsAt->format('Y-m-d'),
        $startsAt->format('H:i')
    ),
]);
});
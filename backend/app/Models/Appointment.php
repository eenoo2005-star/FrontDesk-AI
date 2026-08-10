<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'customer_id',
        'service_id',
        'starts_at',
        'ends_at',
        'status',
        'notes',
        'reminder_sent_at',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'reminder_sent_at' => 'datetime',
    ];
}
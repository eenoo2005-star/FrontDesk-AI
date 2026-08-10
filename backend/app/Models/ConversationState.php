<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConversationState extends Model
{
    protected $fillable = [
        'customer_id',
        'intent',
        'service_name',
        'requested_date',
        'requested_time',
        'waiting_for',
        'context',
        'expires_at',
    ];

    protected $casts = [
        'requested_date' => 'date:Y-m-d',
        'context' => 'array',
        'expires_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversation_states', function (Blueprint $table) {
            $table->id();

            $table->foreignId('customer_id')
                ->constrained('customers')
                ->cascadeOnDelete();

            $table->string('intent')->nullable();

            $table->string('service_name')->nullable();

            $table->date('requested_date')->nullable();

            $table->string('requested_time', 5)->nullable();

            $table->string('waiting_for')->nullable();

            $table->jsonb('context')->nullable();

            $table->timestamp('expires_at')->nullable();

            $table->timestamps();

            $table->unique('customer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversation_states');
    }
};
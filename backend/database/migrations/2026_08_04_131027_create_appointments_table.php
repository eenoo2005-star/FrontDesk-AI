<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up(): void
{
    Schema::create('appointments', function (Blueprint $table) {
        $table->id();

        $table->foreignId('customer_id')
            ->constrained();

        $table->foreignId('service_id')
            ->constrained();

        $table->timestamp('starts_at');
        $table->timestamp('ends_at');

        $table->string('status')->default('confirmed');
        $table->text('notes')->nullable();
        $table->timestamp('reminder_sent_at')->nullable();

        $table->timestamps();

        $table->index(['starts_at', 'ends_at']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};

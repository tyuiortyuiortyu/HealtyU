<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->dateTime('last_login')->nullable();
            $table->string('username', 50)->unique();
            $table->string('password', 60); //ini karena mau pake bcrypt makanya lengthnya 60
            $table->date('dob')->nullable();
            $table->string('sex', 6)->nullable();
            $table->decimal('weight', 5,2)->nullable();
            $table->decimal('height', 5,2)->nullable();
            $table->enum('role', ['user', 'admin'])->default('user');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};

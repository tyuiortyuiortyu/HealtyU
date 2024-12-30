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
            $table->timestamp('email_verified_at')->nullable();
            $table->dateTime('last_login')->nullable();
            $table->string('username', 50)->unique();
            $table->string('password',60); //ini karena mau pake bcrypt makanya lengthnya 60
            $table->date('dob');
            $table->string('sex', 6);
            $table->decimal('weight', 5,2);
            $table->decimal('height', 5,2);
            $table->rememberToken();
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

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Fascades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        foreach(range(1,2) as $index){
            DB::table('users')->insert([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'email_verified_at' => Carbon::now,
                'username' => $faker->userName,
                'password' => bcrypt($faker->password(8,16)),
                'dob' => $faker->date,
                'sex' => $faker->randomElement(['Male','Female']),
                'weight' => $faker->randomFloat(2, 40, 100),
                'height' => $faker->randomFloat(2, 150, 200),
                'last_login' => Carbon::now(),
                'date_created' => date('Y-m-d H:i:s'),
                'date_modified' => date('Y-m-d H:i:s'),
                'role' => 'admin'
            ]);
        }

        DB::table('users')->insert([
            'name' => $faker->name,
            'email' => $faker->unique()->safeEmail,
            'email_verified_at' => Carbon::now,
            'username' => $faker->userName,
            'password' => bcrypt($faker->password(8,16)),
            'dob' => $faker->date,
            'sex' => $faker->randomElement(['Male','Female']),
            'weight' => $faker->randomFloat(2, 40, 100),
            'height' => $faker->randomFloat(2, 150, 200),
            'last_login' => Carbon::now(),
            'date_created' => date('Y-m-d H:i:s'),
            'date_modified' => date('Y-m-d H:i:s'),
            'role' => 'user'
        ]);


    }
}

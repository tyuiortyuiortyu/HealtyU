<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        $now = Carbon::now()->format('Y-m-d H:i:s');

        User::create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'username' => 'admin',
            'password' => bcrypt('admin123'),
            'dob' => $faker->date('Y-m-d', '2005-12-31'),
            'sex' => $faker->randomElement(['male','female']),
            'weight' => $faker->randomFloat(2, 40, 100),
            'height' => $faker->randomFloat(2, 150, 200),
            'last_login' => null,
            'role' => 'admin'
        ]);

        User::create([
            'name' => 'user',
            'email' => 'user@user.com',
            'username' => 'user',
            'password' => bcrypt('admin123'),
            'dob' => $faker->date('Y-m-d', '2005-12-31'),
            'sex' => $faker->randomElement(['male','female']),
            'weight' => $faker->randomFloat(2, 40, 100),
            'height' => $faker->randomFloat(2, 150, 200),
            'last_login' => null,
            'role' => 'user'
        ]);

        for ($i = 0; $i < 28; $i++) {
            User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'username' => $faker->unique()->userName,
                'password' => bcrypt('healthyu123'),
                'dob' => $faker->date('Y-m-d', '2005-12-31'),
                'sex' => $faker->randomElement(['male', 'female']),
                'weight' => $faker->randomFloat(2, 40, 100),
                'height' => $faker->randomFloat(2, 150, 200),
                'last_login' => null,
                'role' => $faker->randomElement(['user', 'admin'])
            ]);
        }
    }
}

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
            'password' => bcrypt('user123'),
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
                'role' => $faker->randomElement(['user', 'admin']),
                'profile_picture' => null,
            ]);
        }

        User::create([
            'name' => 'Michael Kurniawan',
            'email' => 'mchlkk98@gmail.com',
            'username' => 'mikelaja',
            'password' => bcrypt('Mikel123'),
            'dob' => $faker->date('Y-m-d', '2005-12-31'),
            'sex' => 'male',
            'weight' => $faker->randomFloat(2, 40, 100),
            'height' => $faker->randomFloat(2, 150, 200),
            'last_login' => null,
            'role' => 'user'
        ]);

        User::create([
            'name' => 'Nikita',
            'email' => 'nikitasmile@gmail.com',
            'username' => 'smilee',
            'password' => bcrypt('Niki1234'),
            'dob' => $faker->date('Y-m-d', '2005-12-31'),
            'sex' => 'female',
            'weight' => $faker->randomFloat(2, 40, 100),
            'height' => $faker->randomFloat(2, 150, 200),
            'last_login' => null,
            'role' => 'user'
        ]);

        User::create([
            'name' => 'Felis',
            'email' => 'ffhandoyo@gmail.com',
            'username' => 'felisnavidad',
            'password' => bcrypt('Felis123'),
            'dob' => $faker->date('Y-m-d', '2005-12-31'),
            'sex' => 'female',
            'weight' => $faker->randomFloat(2, 40, 100),
            'height' => $faker->randomFloat(2, 150, 200),
            'last_login' => null,
            'role' => 'user'
        ]);

        User::create([
            'name' => 'Arya',
            'email' => 'arya.shodiqi@gmail.com',
            'username' => 'aryaaaaa',
            'password' => bcrypt('Arya1234'),
            'dob' => $faker->date('Y-m-d', '2005-12-31'),
            'sex' => 'male',
            'weight' => $faker->randomFloat(2, 40, 100),
            'height' => $faker->randomFloat(2, 150, 200),
            'last_login' => null,
            'role' => 'user'
        ]);

        User::create([
            'name' => 'Bodhi',
            'email' => 'bodhi@gmail.com',
            'username' => 'bod',
            'password' => bcrypt('Bodhi123'),
            'dob' => $faker->date('Y-m-d', '2005-12-31'),
            'sex' => 'male',
            'weight' => $faker->randomFloat(2, 40, 100),
            'height' => $faker->randomFloat(2, 150, 200),
            'last_login' => null,
            'role' => 'user'
        ]);
    }
}

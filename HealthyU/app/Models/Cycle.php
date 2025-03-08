<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cycle extends Model
{
    use HasFactory;

    protected $table = 'cycle_details'; // Nama tabel dalam database

    protected $fillable = [
        'user_id',
        'start',
        'end',
    ];

    protected $casts = [
        'start' => 'date',
        'end' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

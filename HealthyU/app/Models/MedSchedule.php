<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedSchedule extends Model
{
    use HasFactory;
    protected $table = "med_schedules";

    public function medicine()
    {
        return $this->belongsTo(Medicine::class, 'med_id');
    }
}

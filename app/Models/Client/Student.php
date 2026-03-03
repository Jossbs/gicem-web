<?php

namespace App\Models\Client;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;

    protected $table = 'client.students';

    protected $fillable = [
        'status', 'first_name', 'paternal_surname', 'maternal_surname', 'curp',
        'birth_date', 'nationality', 'birth_state', 'gender', 'photo_path',
        'birth_certificate_path', 'curp_path', 'nss', 'nss_file_path',
        'disability_certificate_path', 'medical_institution', 'blood_type',
        'primary_disability', 'clinical_diagnosis', 'comorbidities',
        'severe_allergies', 'technical_aids', 'school_medication', 'medical_alert',
        'address_street', 'address_number', 'address_colony', 'address_zip_code',
        'guardian_name', 'guardian_relationship', 'guardian_email',
        'emergency_phone_1', 'emergency_phone_2', 'address_proof_path',
        'guardian_ine_path', 'communication_style', 'literacy_level',
        'interests', 'behavioral_triggers', 'autonomy_skills',
        'enrollment_status', 'admission_date', 'group_id'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'admission_date' => 'date',
        'school_medication' => 'array', // Si decides guardar dosis/horario como JSON
    ];

    // Helper para obtener nombre completo
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->paternal_surname} {$this->maternal_surname}";
    }
}

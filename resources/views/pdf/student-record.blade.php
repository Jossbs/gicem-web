<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Expediente — {{ $student->nombre_completo }} {{ $student->apellido_paterno }}</title>
    <style>
        @page {
            margin: 20mm 18mm 25mm 18mm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10px;
            color: #1a1a2e;
            line-height: 1.5;
        }

        /* ── Header ── */
        .header {
            border-bottom: 3px solid #6b1530;
            padding-bottom: 12px;
            margin-bottom: 18px;
        }

        .header-table {
            width: 100%;
        }

        .header-logo {
            width: 58px;
            height: 58px;
        }

        .header-brand {
            padding-left: 12px;
            vertical-align: middle;
        }

        .header-brand-name {
            font-size: 20px;
            font-weight: 800;
            color: #6b1530;
            letter-spacing: 2px;
        }

        .header-brand-sub {
            font-size: 8px;
            font-weight: 600;
            letter-spacing: 2.5px;
            color: #b8860b;
            text-transform: uppercase;
        }

        .header-meta {
            text-align: right;
            vertical-align: middle;
            font-size: 9px;
            color: #666;
        }

        .header-meta strong {
            color: #1a1a2e;
        }

        /* ── Title Banner ── */
        .title-banner {
            background-color: #6b1530;
            color: #fff;
            padding: 14px 18px;
            margin-bottom: 16px;
            border-radius: 4px;
        }

        .title-banner-table {
            width: 100%;
        }

        .title-name {
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        .title-subtitle {
            font-size: 9px;
            color: rgba(255, 255, 255, 0.65);
            margin-top: 2px;
        }

        .title-photo {
            text-align: right;
        }

        .title-photo img {
            width: 72px;
            height: 90px;
            object-fit: cover;
            border: 2px solid rgba(255, 255, 255, 0.25);
            border-radius: 4px;
        }

        .title-photo-placeholder {
            width: 72px;
            height: 90px;
            background: rgba(255, 255, 255, 0.12);
            border: 2px solid rgba(255, 255, 255, 0.25);
            border-radius: 4px;
            display: inline-block;
            text-align: center;
            line-height: 90px;
            font-size: 22px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.5);
        }

        /* ── Status badges ── */
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .badge-active {
            background: rgba(255, 255, 255, 0.18);
            color: #a8e6cf;
        }

        .badge-disability {
            background: rgba(255, 255, 255, 0.18);
            color: rgba(255, 255, 255, 0.8);
        }

        /* ── Section ── */
        .section {
            margin-bottom: 14px;
            page-break-inside: avoid;
        }

        .section-title {
            background-color: #f5f0f2;
            border-left: 4px solid #6b1530;
            padding: 7px 12px;
            margin-bottom: 10px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.5px;
            color: #6b1530;
            text-transform: uppercase;
        }

        /* ── Data grid ── */
        .data-table {
            width: 100%;
            border-collapse: collapse;
        }

        .data-table td {
            padding: 5px 8px;
            vertical-align: top;
            border-bottom: 1px solid #eee;
        }

        .data-label {
            font-size: 8px;
            font-weight: 700;
            letter-spacing: 1px;
            color: #888;
            text-transform: uppercase;
            width: 130px;
        }

        .data-value {
            font-size: 10px;
            color: #1a1a2e;
        }

        .data-value.empty {
            color: #bbb;
            font-style: italic;
        }

        /* ── Two-column layout ── */
        .two-col {
            width: 100%;
            border-collapse: collapse;
        }

        .two-col > tbody > tr > td {
            width: 50%;
            vertical-align: top;
            padding: 0;
        }

        .two-col > tbody > tr > td:first-child {
            padding-right: 8px;
        }

        .two-col > tbody > tr > td:last-child {
            padding-left: 8px;
        }

        /* ── Documents ── */
        .doc-item {
            display: inline-block;
            padding: 4px 10px;
            margin: 2px 4px 2px 0;
            border: 1px solid #ddd;
            border-radius: 3px;
            font-size: 9px;
        }

        .doc-check {
            color: #2d8a56;
            font-weight: 700;
        }

        .doc-pending {
            color: #bbb;
        }

        /* ── Footer ── */
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            border-top: 2px solid #6b1530;
            padding-top: 6px;
            font-size: 8px;
            color: #999;
        }

        .footer-table {
            width: 100%;
        }

        .footer-left {
            text-align: left;
        }

        .footer-center {
            text-align: center;
            font-weight: 600;
            color: #6b1530;
            letter-spacing: 0.5px;
        }

        .footer-right {
            text-align: right;
        }

        /* ── Alert box ── */
        .alert-box {
            border: 1.5px solid #d32f2f;
            background-color: #fff5f5;
            padding: 8px 12px;
            border-radius: 4px;
            margin-top: 8px;
        }

        .alert-box-title {
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 1.5px;
            color: #d32f2f;
            text-transform: uppercase;
            margin-bottom: 3px;
        }

        .alert-box-text {
            font-size: 10px;
            color: #c62828;
        }
    </style>
</head>
<body>

    {{-- ── Footer (fixed on every page) ── --}}
    <div class="footer">
        <table class="footer-table">
            <tr>
                <td class="footer-left">Generado: {{ now()->format('d/m/Y H:i') }}</td>
                <td class="footer-center">GICEM &mdash; Gesti&oacute;n Integral para Centros de Educaci&oacute;n M&uacute;ltiple</td>
                <td class="footer-right">Documento confidencial</td>
            </tr>
        </table>
    </div>

    {{-- ── Header ── --}}
    <div class="header">
        <table class="header-table">
            <tr>
                <td style="width: 62px; vertical-align: middle;">
                    <img src="{{ public_path('images/app-logo.png') }}" class="header-logo" alt="GICEM">
                </td>
                <td class="header-brand">
                    <div class="header-brand-name">GICEM</div>
                    <div class="header-brand-sub">Expedientes Digitales</div>
                </td>
                <td class="header-meta">
                    <div><strong>Expediente Digital del Alumno</strong></div>
                    <div>ID: EXP-{{ str_pad($student->id, 6, '0', STR_PAD_LEFT) }}</div>
                    <div>Ciclo Escolar 2026-A</div>
                </td>
            </tr>
        </table>
    </div>

    {{-- ── Title Banner ── --}}
    <div class="title-banner">
        <table class="title-banner-table">
            <tr>
                <td style="vertical-align: middle;">
                    <div class="title-name">
                        {{ $student->apellido_paterno }} {{ $student->apellido_materno }}, {{ $student->nombre_completo }}
                    </div>
                    <div class="title-subtitle">
                        @if($student->curp)
                            CURP: {{ $student->curp }}
                        @endif
                        @if($student->grado_grupo)
                            &nbsp;&bull;&nbsp; Grupo: {{ $student->grado_grupo }}
                        @endif
                    </div>
                    <div style="margin-top: 6px;">
                        @if($student->estatus_alumno)
                            <span class="badge badge-active">{{ $student->estatus_alumno->label() }}</span>
                        @endif
                        @if($student->discapacidad)
                            <span class="badge badge-disability">{{ $student->discapacidad->label() }}</span>
                        @endif
                    </div>
                </td>
                <td class="title-photo" style="width: 82px;">
                    @if($photoBase64)
                        <img src="{{ $photoBase64 }}" alt="Foto">
                    @else
                        <div class="title-photo-placeholder">{{ strtoupper(substr($student->nombre_completo ?? 'A', 0, 1)) }}</div>
                    @endif
                </td>
            </tr>
        </table>
    </div>

    {{-- ── Datos Generales ── --}}
    <div class="section">
        <div class="section-title">Datos Generales</div>
        <table class="two-col">
            <tr>
                <td>
                    <table class="data-table">
                        <tr>
                            <td class="data-label">CURP</td>
                            <td class="data-value {{ !$student->curp ? 'empty' : '' }}">{{ $student->curp ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Nombre(s)</td>
                            <td class="data-value">{{ $student->nombre_completo ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Apellido Paterno</td>
                            <td class="data-value">{{ $student->apellido_paterno ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Apellido Materno</td>
                            <td class="data-value">{{ $student->apellido_materno ?? 'No registrado' }}</td>
                        </tr>
                    </table>
                </td>
                <td>
                    <table class="data-table">
                        <tr>
                            <td class="data-label">Fecha Nacimiento</td>
                            <td class="data-value {{ !$student->fecha_nacimiento ? 'empty' : '' }}">{{ $student->fecha_nacimiento?->format('d/m/Y') ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Nacionalidad</td>
                            <td class="data-value {{ !$student->nacionalidad ? 'empty' : '' }}">{{ $student->nacionalidad ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Entidad Federativa</td>
                            <td class="data-value {{ !$student->entidad_federativa ? 'empty' : '' }}">{{ $student->entidad_federativa ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">G&eacute;nero</td>
                            <td class="data-value {{ !$student->genero ? 'empty' : '' }}">{{ $student->genero?->label() ?? 'No registrado' }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>

    {{-- ── Perfil de Salud ── --}}
    <div class="section">
        <div class="section-title">Perfil de Salud</div>
        <table class="two-col">
            <tr>
                <td>
                    <table class="data-table">
                        <tr>
                            <td class="data-label">Discapacidad</td>
                            <td class="data-value {{ !$student->discapacidad ? 'empty' : '' }}">{{ $student->discapacidad?->label() ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Diagn&oacute;stico</td>
                            <td class="data-value {{ !$student->diagnostico_medico ? 'empty' : '' }}">{{ $student->diagnostico_medico ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Comorbilidades</td>
                            <td class="data-value {{ !$student->comorbilidades ? 'empty' : '' }}">{{ $student->comorbilidades ?? 'Ninguna' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Alergias Graves</td>
                            <td class="data-value {{ !$student->alergias_graves ? 'empty' : '' }}">{{ $student->alergias_graves ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Uso de Aparatos</td>
                            <td class="data-value {{ !$student->uso_aparatos ? 'empty' : '' }}">{{ $student->uso_aparatos ?? 'No registrado' }}</td>
                        </tr>
                    </table>
                </td>
                <td>
                    <table class="data-table">
                        <tr>
                            <td class="data-label">NSS</td>
                            <td class="data-value {{ !$student->nss ? 'empty' : '' }}">{{ $student->nss ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Instituci&oacute;n M&eacute;dica</td>
                            <td class="data-value {{ !$student->institucion_medica ? 'empty' : '' }}">{{ $student->institucion_medica?->label() ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Tipo de Sangre</td>
                            <td class="data-value {{ !$student->tipo_sangre ? 'empty' : '' }}">{{ $student->tipo_sangre?->label() ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Medicaci&oacute;n</td>
                            <td class="data-value {{ !$student->medicacion_nombre ? 'empty' : '' }}">
                                @if($student->medicacion_nombre)
                                    {{ $student->medicacion_nombre }}
                                    @if($student->medicacion_dosis) &mdash; {{ $student->medicacion_dosis }} @endif
                                    @if($student->medicacion_horario) &mdash; {{ $student->medicacion_horario }} @endif
                                @else
                                    Ninguna
                                @endif
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        @if($student->alerta_medica)
            <div class="alert-box">
                <div class="alert-box-title">Alerta M&eacute;dica</div>
                <div class="alert-box-text">{{ $student->alerta_medica }}</div>
            </div>
        @endif
    </div>

    {{-- ── Entorno Familiar ── --}}
    <div class="section">
        <div class="section-title">Entorno Familiar y Contacto</div>
        <table class="two-col">
            <tr>
                <td>
                    <table class="data-table">
                        <tr>
                            <td class="data-label">Tutor</td>
                            <td class="data-value">
                                {{ collect([$student->tutor_nombre, $student->tutor_apellido_paterno, $student->tutor_apellido_materno])->filter()->join(' ') ?: 'No registrado' }}
                            </td>
                        </tr>
                        <tr>
                            <td class="data-label">Parentesco</td>
                            <td class="data-value {{ !$student->tutor_parentesco ? 'empty' : '' }}">{{ $student->tutor_parentesco?->label() ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Tel&eacute;fono 1</td>
                            <td class="data-value {{ !$student->tel_emergencia_1 ? 'empty' : '' }}">{{ $student->tel_emergencia_1 ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Tel&eacute;fono 2</td>
                            <td class="data-value {{ !$student->tel_emergencia_2 ? 'empty' : '' }}">{{ $student->tel_emergencia_2 ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Correo</td>
                            <td class="data-value {{ !$student->correo_tutor ? 'empty' : '' }}">{{ $student->correo_tutor ?? 'No registrado' }}</td>
                        </tr>
                    </table>
                </td>
                <td>
                    <table class="data-table">
                        <tr>
                            <td class="data-label">Calle y N&uacute;mero</td>
                            <td class="data-value {{ !$student->domicilio_calle ? 'empty' : '' }}">
                                {{ collect([$student->domicilio_calle, $student->domicilio_numero])->filter()->join(' ') ?: 'No registrado' }}
                            </td>
                        </tr>
                        <tr>
                            <td class="data-label">Colonia</td>
                            <td class="data-value {{ !$student->domicilio_colonia ? 'empty' : '' }}">{{ $student->domicilio_colonia ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Municipio</td>
                            <td class="data-value {{ !$student->domicilio_municipio ? 'empty' : '' }}">{{ $student->domicilio_municipio ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Estado</td>
                            <td class="data-value {{ !$student->domicilio_estado ? 'empty' : '' }}">{{ $student->domicilio_estado ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">C&oacute;digo Postal</td>
                            <td class="data-value {{ !$student->domicilio_cp ? 'empty' : '' }}">{{ $student->domicilio_cp ?? 'No registrado' }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>

    {{-- ── Perfil Psicopedagógico ── --}}
    <div class="section">
        <div class="section-title">Perfil Psicopedag&oacute;gico</div>
        <table class="two-col">
            <tr>
                <td>
                    <table class="data-table">
                        <tr>
                            <td class="data-label">Comunicaci&oacute;n</td>
                            <td class="data-value {{ !$student->comunicacion_tipo ? 'empty' : '' }}">{{ $student->comunicacion_tipo?->label() ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Lectoescritura</td>
                            <td class="data-value {{ !$student->nivel_lectoescritura ? 'empty' : '' }}">{{ $student->nivel_lectoescritura?->label() ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Autonom&iacute;a</td>
                            <td class="data-value {{ empty($student->habilidades_autonomia) ? 'empty' : '' }}">
                                @if(!empty($student->habilidades_autonomia))
                                    {{ collect($student->habilidades_autonomia)->map(fn ($s) => \App\Enums\AutonomySkill::tryFrom($s)?->label() ?? $s)->join(', ') }}
                                @else
                                    Ninguna
                                @endif
                            </td>
                        </tr>
                    </table>
                </td>
                <td>
                    <table class="data-table">
                        <tr>
                            <td class="data-label">Intereses</td>
                            <td class="data-value {{ !$student->intereses_alumnos ? 'empty' : '' }}">{{ $student->intereses_alumnos ?? 'No registrado' }}</td>
                        </tr>
                        <tr>
                            <td class="data-label">Detonantes</td>
                            <td class="data-value {{ !$student->detonantes_conducta ? 'empty' : '' }}">{{ $student->detonantes_conducta ?? 'No registrado' }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>

    {{-- ── Control Administrativo ── --}}
    <div class="section">
        <div class="section-title">Control Administrativo</div>
        <table class="data-table" style="width: 50%;">
            <tr>
                <td class="data-label">Estatus</td>
                <td class="data-value {{ !$student->estatus_alumno ? 'empty' : '' }}">{{ $student->estatus_alumno?->label() ?? 'No registrado' }}</td>
            </tr>
            <tr>
                <td class="data-label">Grado / Grupo</td>
                <td class="data-value {{ !$student->grado_grupo ? 'empty' : '' }}">{{ $student->grado_grupo ?? 'Sin asignar' }}</td>
            </tr>
            <tr>
                <td class="data-label">Fecha de Ingreso</td>
                <td class="data-value {{ !$student->fecha_ingreso ? 'empty' : '' }}">{{ $student->fecha_ingreso?->format('d/m/Y') ?? 'No registrado' }}</td>
            </tr>
        </table>
    </div>

    {{-- ── Documentos ── --}}
    <div class="section">
        <div class="section-title">Documentos Entregados</div>
        <div style="padding: 4px 0;">
            @foreach($documents as $doc)
                <span class="doc-item">
                    @if($doc['exists'])
                        <span class="doc-check">&#10003;</span>
                    @else
                        <span class="doc-pending">&#9675;</span>
                    @endif
                    {{ $doc['label'] }}
                </span>
            @endforeach
        </div>
    </div>

    {{-- ── Signature area ── --}}
    <div style="margin-top: 30px; page-break-inside: avoid;">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="width: 45%; text-align: center; padding-top: 40px;">
                    <div style="border-top: 1px solid #999; width: 80%; margin: 0 auto; padding-top: 5px;">
                        <div style="font-size: 9px; font-weight: 700; color: #333;">Firma del Responsable</div>
                        <div style="font-size: 8px; color: #888;">Nombre y cargo</div>
                    </div>
                </td>
                <td style="width: 10%;"></td>
                <td style="width: 45%; text-align: center; padding-top: 40px;">
                    <div style="border-top: 1px solid #999; width: 80%; margin: 0 auto; padding-top: 5px;">
                        <div style="font-size: 9px; font-weight: 700; color: #333;">Sello Institucional</div>
                        <div style="font-size: 8px; color: #888;">GICEM</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>

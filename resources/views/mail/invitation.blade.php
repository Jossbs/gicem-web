<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitacion GICEM</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f3f1; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f3f1; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

                    {{-- Header con logo --}}
                    <tr>
                        <td align="center" style="padding-bottom: 24px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background-color: #5a1a2a; border-radius: 12px; padding: 16px 24px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding-right: 12px; vertical-align: middle;">
                                                    <img src="{{ $message->embed(public_path('images/app-logo.png')) }}" alt="GICEM" width="40" height="40" style="display: block; border-radius: 8px;">
                                                </td>
                                                <td style="vertical-align: middle;">
                                                    <span style="color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 2px;">GICEM</span>
                                                    <br>
                                                    <span style="color: #d4a855; font-size: 9px; font-weight: 600; letter-spacing: 3px;">EXPEDIENTES DIGITALES</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Cuerpo principal --}}
                    <tr>
                        <td>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

                                {{-- Barra decorativa superior --}}
                                <tr>
                                    <td style="height: 4px; background: linear-gradient(90deg, #5a1a2a, #d4a855);"></td>
                                </tr>

                                {{-- Saludo --}}
                                <tr>
                                    <td style="padding: 40px 40px 0 40px;">
                                        <h1 style="margin: 0 0 8px 0; color: #5a1a2a; font-size: 24px; font-weight: 700;">
                                            {{ $greeting }}
                                        </h1>
                                        <p style="margin: 0; color: #888; font-size: 14px;">
                                            {{ $subgreeting }}
                                        </p>
                                    </td>
                                </tr>

                                {{-- Mensaje principal --}}
                                <tr>
                                    <td style="padding: 24px 40px 0 40px;">
                                        <p style="margin: 0 0 16px 0; color: #444; font-size: 15px; line-height: 1.7;">
                                            {{ $introLine }}
                                        </p>
                                    </td>
                                </tr>

                                {{-- Beneficios --}}
                                <tr>
                                    <td style="padding: 8px 40px 0 40px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf8f5; border-radius: 12px; padding: 20px;">
                                            <tr>
                                                <td style="padding: 20px;">
                                                    <p style="margin: 0 0 12px 0; color: #5a1a2a; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                                                        Con tu cuenta podras:
                                                    </p>
                                                    @foreach ($benefits as $benefit)
                                                        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
                                                            <tr>
                                                                <td style="vertical-align: top; padding-right: 10px; color: #d4a855; font-size: 16px;">&#10003;</td>
                                                                <td style="color: #555; font-size: 14px; line-height: 1.5;">{{ $benefit }}</td>
                                                            </tr>
                                                        </table>
                                                    @endforeach
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                {{-- Boton CTA --}}
                                <tr>
                                    <td align="center" style="padding: 32px 40px 8px 40px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="background-color: #5a1a2a; border-radius: 10px;">
                                                    <a href="{{ $actionUrl }}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; font-size: 14px; font-weight: 700; letter-spacing: 1.5px; text-decoration: none; text-transform: uppercase;">
                                                        CREAR MI CONTRASENA
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="margin: 12px 0 0 0; color: #aaa; font-size: 12px;">
                                            Este enlace expira en {{ $expirationMinutes }} minutos.
                                        </p>
                                    </td>
                                </tr>

                                {{-- Nota de seguridad --}}
                                <tr>
                                    <td style="padding: 24px 40px 0 40px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left: 3px solid #d4a855; padding-left: 16px;">
                                            <tr>
                                                <td style="padding-left: 16px;">
                                                    <p style="margin: 0; color: #888; font-size: 13px; line-height: 1.6;">
                                                        <strong style="color: #666;">Nota de seguridad:</strong> Si no esperabas esta invitacion, puedes ignorar este correo. Nadie mas tiene acceso a este enlace.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                {{-- Separador y pie --}}
                                <tr>
                                    <td style="padding: 32px 40px 32px 40px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="border-top: 1px solid #eee; padding-top: 20px;">
                                                    <p style="margin: 0 0 4px 0; color: #444; font-size: 14px;">Atentamente,</p>
                                                    <p style="margin: 0; color: #5a1a2a; font-size: 14px; font-weight: 700;">Equipo GICEM</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- URL alternativa --}}
                    <tr>
                        <td style="padding: 24px 20px 0 20px;">
                            <p style="margin: 0; color: #999; font-size: 11px; text-align: center; line-height: 1.6;">
                                Si el boton no funciona, copia y pega este enlace en tu navegador:
                                <br>
                                <a href="{{ $actionUrl }}" style="color: #5a1a2a; word-break: break-all;">{{ $actionUrl }}</a>
                            </p>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td align="center" style="padding: 32px 20px 0 20px;">
                            <p style="margin: 0; color: #bbb; font-size: 11px; letter-spacing: 1px;">
                                &copy; {{ date('Y') }} GICEM &middot; Gestion Integral para Centros de Educacion Multiple
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

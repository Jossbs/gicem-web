import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Asumo que tienes componentes base
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Componente de Shadcn
import { FormEvent } from 'react';

export default function CreateStudent({ catalogs }: { catalogs: any }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        paternal_surname: '',
        maternal_surname: '',
        curp: '',
        // ... inicializar todos los campos
        doc_acta_nacimiento: null as File | null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('students.store'));
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-primary">Nuevo Expediente de Alumno</h1>

            <form onSubmit={handleSubmit}>
                <Tabs defaultValue="identificacion" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="identificacion">Identificación</TabsTrigger>
                        <TabsTrigger value="salud">Salud</TabsTrigger>
                        <TabsTrigger value="familiar">Familiar</TabsTrigger>
                        <TabsTrigger value="academico">Académico</TabsTrigger>
                    </TabsList>

                    {/* --- Pestaña 1: Identificación --- */}
                    <TabsContent value="identificacion" className="space-y-4 border p-4 rounded-md mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="curp">CURP</Label>
                                <Input
                                    id="curp"
                                    value={data.curp}
                                    onChange={e => setData('curp', e.target.value.toUpperCase())}
                                    maxLength={18}
                                    placeholder="ABCD010101..."
                                />
                                {errors.curp && <p className="text-red-500 text-sm">{errors.curp}</p>}
                            </div>

                            {/* ... agregar más campos de Identificación ... */}

                            <div>
                                <Label htmlFor="doc_acta_nacimiento">Acta de Nacimiento (PDF)</Label>
                                <Input
                                    type="file"
                                    id="doc_acta_nacimiento"
                                    accept=".pdf"
                                    onChange={e => setData('doc_acta_nacimiento', e.target.files?.[0] || null)}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* --- Pestaña 2: Salud --- */}
                    <TabsContent value="salud" className="space-y-4 border p-4 rounded-md mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="blood_type">Tipo de Sangre</Label>
                                <select
                                    id="blood_type"
                                    className="border rounded px-3 py-2 w-full"
                                    value={data.blood_type}
                                    onChange={e => setData('blood_type', e.target.value)}
                                >
                                    <option value="">Seleccione...</option>
                                    {catalogs.blood_types.map((type: string) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ... campos de alergias y discapacidad ... */}
                        </div>
                    </TabsContent>

                    {/* --- Pestaña 3: Familiar --- */}
                    {/* ... campos de domicilio y tutor ... */}

                    {/* --- Pestaña 4: Académico --- */}
                    {/* ... campos de inscripción y grupo ... */}
                </Tabs>

                <div className="mt-8 flex justify-end gap-4">
                    <Button variant="outline" type="button" onClick={() => {/* Lógica Borrador */}}>
                        Guardar Borrador
                    </Button>
                    <Button type="submit" disabled={processing}>
                        Finalizar Registro
                    </Button>
                </div>
            </form>
        </div>
    );
}

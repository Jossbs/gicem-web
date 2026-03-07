const prefixes: Record<string, string> = {
    student: 'EXP',
    staff: 'PER',
    guardian: 'TUT',
};

export function formatRecordId(id: number, type: keyof typeof prefixes): string {
    return `${prefixes[type]}-${String(id).padStart(6, '0')}`;
}

export function CubePatternBg() {
    return (
        <div
            className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
            aria-hidden="true"
            style={{
                backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
                backgroundRepeat: 'repeat',
            }}
        />
    );
}

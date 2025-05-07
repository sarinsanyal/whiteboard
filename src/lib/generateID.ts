export default function generateRoomID(): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';

    const getRandomChar = (set: string) => set[Math.floor(Math.random() * set.length)];

    const part1 = Array.from({ length: 4 }, () => getRandomChar(letters)).join('');
    const part2 = Array.from({ length: 3 }, () => getRandomChar(digits)).join('');

    return part1 + part2;
}
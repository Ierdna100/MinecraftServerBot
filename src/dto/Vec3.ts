export class Vec3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    equals(vec3: Vec3) {
        return vec3.x == this.x && vec3.y == this.y && vec3.z == this.z;
    }
}

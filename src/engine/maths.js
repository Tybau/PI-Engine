export class Mat4{
	constructor(){
		this.matrix = [];
		for(let i = 0; i < 4; i++){
			this.matrix[i] = [];
			for(let j = 0; j < 4; j++)
				this.matrix[i].push(0);
		}
		for(let i = 0; i < 4; i++)
			this.matrix[i][i] = 1;
	}
	copy(){
		let mat = new Mat4();
		mat.setMatrix(this.matrix);
		return mat;
	}
	mul(mat){
		let tmp = []

		for(let i = 0; i < 4; i++){
			tmp[i] = []
			for(let j = 0; j < 4; j++){
				tmp[i][j] = 0;
				for(let k = 0; k < 4; k++)
					tmp[i][j] += mat.matrix[i][k] * this.matrix[k][j];
			}
		}
		this.setMatrix(tmp);

		return this;
	}
	translate(x, y, z){
		let i = new Mat4();

		i.matrix[0][3] = x;
		i.matrix[1][3] = y;
		i.matrix[2][3] = z;

		return this.mul(i);
	}
	rotateX(a){
		let i = new Mat4();

		i.matrix[1][1] = Math.cos(a);
		i.matrix[2][1] = -Math.sin(a);
		i.matrix[1][2] = Math.sin(a);
		i.matrix[2][2] = Math.cos(a);

		return this.mul(i);
	}
	rotateY(a){
		let i = new Mat4();

		i.matrix[0][0] = Math.cos(a);
		i.matrix[2][0] = Math.sin(a);
		i.matrix[0][2] = -Math.sin(a);
		i.matrix[2][2] = Math.cos(a);

		return this.mul(i);
	}
	rotateZ(a){
		let i = new Mat4();

		i.matrix[0][0] = Math.cos(a);
		i.matrix[1][0] = -Math.sin(a);
		i.matrix[0][1] = Math.sin(a);
		i.matrix[1][1] = Math.cos(a);

		return this.mul(i);
	}
	rotate(x, y, z){
		this.rotateX(x);
		this.rotateY(y);
		this.rotateZ(z);

		return this;
	}
	scale(x, y, z){
		let i = new Mat4();

		i.matrix[0][0] = x;
		i.matrix[1][1] = y;
		i.matrix[2][2] = z;

		return this.mul(i);
	}
	perspective(fov, aspect, zNear, zFar){
		let FOV = Math.tan((fov / 2.0) * Math.PI / 180.0);
		let dist = zNear - zFar;

		this.matrix[0][0] = 1.0 / (FOV * aspect);
		this.matrix[1][1] = 1.0 / FOV;
	    this.matrix[2][2] = (-zNear - zFar) / dist;
	    this.matrix[2][3] = 2.0 * zFar * zNear / dist;
	    this.matrix[3][2] = 1.0;
	    this.matrix[3][3] = 0.0;

		return this;
	}
	ortho(left, right, bottom, top, zNear, zFar){
		this.matrix[0][0] = 2 / (right - left);
        this.matrix[1][1] = 2 / (top - bottom);
        this.matrix[2][2] = -2 / (zFar - zNear);

        this.matrix[3][0] = 0;
        this.matrix[3][1] = 0;
        this.matrix[3][2] = -(zFar + zNear) / (zFar - zNear);

		return this;
	}
	lookAt(eye, target, up) {
		let zaxis = target.subVector(eye).normalize();
    	let xaxis = up.copy().cross(zaxis).normalize();
    	let yaxis = zaxis.copy().cross(xaxis);

		let i = new Mat4();

		i.matrix[0][0] = xaxis.x;
		i.matrix[0][1] = yaxis.x;
		i.matrix[0][2] = zaxis.x;

		i.matrix[1][0] = xaxis.y;
		i.matrix[1][1] = yaxis.y;
		i.matrix[1][2] = zaxis.y;

		i.matrix[2][0] = xaxis.z;
		i.matrix[2][1] = yaxis.z;
		i.matrix[2][2] = zaxis.z;

		i.matrix[3][0] = -xaxis.dot(eye);
		i.matrix[3][1] = -yaxis.dot(eye);
		i.matrix[3][3] = -zaxis.dot(eye);

		return this.mul(i);
	}
	flatten(){
		let res = [];
		for(let i = 0; i < 4; i++)
			for(let j = 0; j < 4; j++)
				res.push(this.matrix[j][i]);
		return res;
	}

	/* Getters and Setters */
	getMatrix(){
		return this.matrix;
	}
	setMatrix(matrix){
		for(let i = 0; i < 4; i++)
			for(let j = 0; j < 4; j++)
				this.matrix[i][j] = matrix[i][j];
	}
}

export class Vec3{
	constructor(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
	}
	copy(){
		return new Vec3(this.x, this.y, this.z);
	}
	length(){
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	normalize(){
		return this.div(this.length());
	}
	addVector(v){
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}
	subVector(v){
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}
	mulVector(v){
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		return this;
	}
	mul(v){
		this.x *= v;
		this.y *= v;
		this.z *= v;
		return this;
	}
	div(v){
		this.x /= v;
		this.y /= v;
		this.z /= v;
		return this;
	}
	dot(v){
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
	cross(v){
		let nx = this.y * v.z - this.z * v.y;
		let ny = this.z * v.x - this.x * v.z;
		let nz = this.x * v.y - this.y * v.x;

		return new Vec3(nx, ny, nz);
	}
	getArray(){
		return [this.x, this.y, this.z];
	}
}

export class Vec2{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	copy(){
		return new Vec3(this.x, this.y);
	}
	length(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	normalize(){
		return this.div(this.length());
	}
	addVector(v){
		this.x += v.x;
		this.y += v.y;
		return this;
	}
	subVector(v){
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}
	mul(v){
		this.x *= v;
		this.y *= v;
		return this;
	}
	div(v){
		this.x /= v;
		this.y /= v;
		return this;
	}
	dot(v){
		return this.x * v.x + this.y * v.y;
	}
	getArray(){
		return [this.x, this.y];
	}
}

export class Color4{
	constructor(r, g, b, a){
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
	getArray(){
		return [this.r, this.g, this.b, this.a];
	}
}

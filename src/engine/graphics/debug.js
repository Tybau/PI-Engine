export class Primitives {
	constructor (gl, instances_count) {
		this.gl = gl;
		this.vertices = [0.0, 0.0, 0.0, 1.0, 1.0, 1.0];
		this.datas = [];
		this.indices = [0, 1];

		this.vao = gl.createVertexArray();
		this.vbo = gl.createBuffer();
		this.vio = gl.createBuffer();
		this.ibo = gl.createBuffer();

		for(let i = 0; i < instances_count * 23; i++)
			this.datas.push(0);

		gl.bindVertexArray(this.vao);
			gl.enableVertexAttribArray(0);
			gl.enableVertexAttribArray(1);
			gl.enableVertexAttribArray(2);
			gl.enableVertexAttribArray(3);
			gl.enableVertexAttribArray(4);
			gl.enableVertexAttribArray(5);
			gl.enableVertexAttribArray(6);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
			gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vio);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.datas), gl.DYNAMIC_DRAW);
			gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 22 * 4, 0);
			gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 22 * 4, 3 * 4);
			gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 22 * 4, 7 * 4);
			gl.vertexAttribPointer(4, 4, gl.FLOAT, false, 22 * 4, 11 * 4);
			gl.vertexAttribPointer(5, 4, gl.FLOAT, false, 22 * 4, 15 * 4);
			gl.vertexAttribPointer(6, 3, gl.FLOAT, false, 22 * 4, 19 * 4);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), gl.STATIC_DRAW);
			
			gl.vertexAttribDivisor(0, 0);
			gl.vertexAttribDivisor(1, 1);
			gl.vertexAttribDivisor(2, 1);
			gl.vertexAttribDivisor(3, 1);
			gl.vertexAttribDivisor(4, 1);	
			gl.vertexAttribDivisor(5, 1);
			gl.vertexAttribDivisor(6, 1);
		gl.bindVertexArray(null);
	}

	setDatas (vecs, transforms, colors) {
		this.datas = [];
		for(let i = 0; i < vecs.length; i++) {
			this.datas.push(vecs[i].x);
			this.datas.push(vecs[i].y);
			this.datas.push(vecs[i].z);

			transforms[i].flatten().forEach(v => {
				this.datas.push(v);
			});

			this.datas.push(colors[i].r);
			this.datas.push(colors[i].g);
			this.datas.push(colors[i].b);
		}

		let gl = this.gl;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vio);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.datas), gl.DYNAMIC_DRAW);
	}

	render (shader) {
		let gl = this.gl;
		gl.bindVertexArray(this.vao);
		gl.drawElementsInstanced(gl.LINES, this.indices.length, gl.UNSIGNED_INT, 0, this.datas.length / 23);
		gl.bindVertexArray(null);
	}
}
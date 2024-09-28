export class Company {
	static async addCompany(c, data) {
		const { name, scale, field, address, logo } = data;
		const query = 'INSERT INTO Company (name, scale, field, address, logo) VALUES (?, ?, ?, ?, ?)';
		const info = await c.env.DB.prepare(query)
			.bind(name ?? '', scale ?? '', field ?? '', address ?? '', logo ?? '')
			.run();
		return info;
	}
	static async getIdLast(c) {
		const query = 'SELECT MAX(id) as last_id FROM Company';
		const info = await c.env.DB.prepare(query).first('last_id');
		return info;
	}
	static async getCompanyWithId(c, id) {
		const query = 'SELECT * FROM Company where id = ?';
		const info = await c.env.DB.prepare(query).bind(id).all();
		return info;
	}
}

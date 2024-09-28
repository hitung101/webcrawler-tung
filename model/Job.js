export class Job {
	static async addJob(c, data) {
		const {
			title,
			description,
			location,
			experience,
			requirement,
			lower_bound,
			upper_bound,
			expiration_date,
			job_type,
			created_at,
			url,
			unit,
			slug,
			company_id,
		} = data;
		const query =
			'INSERT INTO Jobs (title, description, experience, requirement, location, url, lower_bound, upper_bound, expiration_date, job_type, created_at, unit, slug, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
		const { success } = await c.env.DB.prepare(query)
			.bind(
				title ?? '',
				description ?? '',
				experience ?? '',
				requirement ?? '',
				location ?? '',
				url ?? '',
				lower_bound ?? 0,
				upper_bound ?? 0,
				expiration_date ?? '',
				job_type ?? '',
				created_at ?? '',
				unit ?? '',
				slug ?? '',
				company_id ?? ''
			)
			.run();
		return success;
	}
	static async getListJob(c, keyword, location, limit, offset) {
		let { results } = await c.env.DB.prepare(`SELECT * FROM Jobs where title like ?1 and location like ?2 LIMIT ?3 OFFSET ?4`)
			.bind(keyword, location, limit, offset)
			.all();
		return results;
	}
	static async getJob(c, slug) {
		let { results } = await c.env.DB.prepare(`SELECT * FROM Jobs where slug = ?1`).bind(slug).all();
		return results;
	}
	static async totalJobs(c) {
		return await c.env.DB.prepare(`SELECT COUNT(*) as total_count FROM Jobs`).first('total_count');
	}
}

import { Company } from '../model/Company';
import { Job } from '../model/Job';
import { createSlug } from '../utils/CreateSlug';

export class JobController {
	static async getListJob(c) {
		const page = parseInt(c.req.query('page') || '1', 10);
		const limit = c.req.query('limit') ?? 10;
		const offset = page > 0 ? (page - 1) * limit : 0;
		const keyword = c.req.query('keyword') ? '%' + c.req.query('keyword') + '%' : '%%';
		const location = c.req.query('location') ? '%' + c.req.query('location') + '%' : '%%';
		try {
			const totalJobs = await Job.totalJobs(c);
			const results = await Job.getListJob(c, keyword, location, limit, offset);
			return c.json({
				success: true,
				data: results,
				pagination: {
					currentPage: page,
					totalItems: totalJobs,
					totalPages: Math.ceil(totalJobs / limit),
				},
			});
		} catch (error) {
			return c.json({ success: false, message: error.message }, 500);
		}
	}
	static async getJob(c) {
		const slug = c.req.param('slug');
		try {
			const result = await Job.getJob(c, slug);
			return c.json({
				success: true,
				data: result,
			});
		} catch (error) {
			return c.json({ success: false, message: error.message }, 500);
		}
	}
	static async addJob(c) {
		try {
			// Đọc thông tin từ request body
			const body = await c.req.json();
			console.log(body);
			// Ví dụ body có cấu trúc như sau: { "name": "John", "age": 30 }
			const { title, description, location, experience, requirement, salary, expiration_date, job_type, created_at, url, company } = body;
			const number = salary.match(/\d+/g);
			// lấy đơn vị tính
			var unit = '';
			const regex1 = /\b(usd)\b/i;
			const regex2 = /\b(triệu)\b/i;
			// lấy khoảng lương
			var lower_bound = 0;
			var upper_bound = 0;
			const regex3 = /^(tới)/;
			const regex4 = /^(trên)/;
			if (salary.match(regex1)) {
				unit = 'USD';
			} else if (salary.match(regex2)) {
				unit = 'triệu vnd';
			}
			if (salary.match(regex3)) {
				lower_bound = 0;
				upper_bound = number[0];
			} else if (salary.match(regex4)) {
				lower_bound = number[0];
				upper_bound = 0;
			} else if (number) {
				lower_bound = number[0];
				upper_bound = number[1];
			} else {
				lower_bound = 0;
				upper_bound = 0;
			}
			// Thực hiện lệnh SQL để lưu thông tin vào database
			const info_company = await Company.addCompany(c, company);
			const company_id = await Company.getIdLast(c);
			const slug = createSlug(title);
			const status = await Job.addJob(c, {
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
			});
			return c.json({ message: 'saved successfully', status: 'success' }, 200);
		} catch (error) {
			console.error(error);
			return c.json({ message: error }, 500);
		}
	}
}

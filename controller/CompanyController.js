import { Company } from '../model/Company';
import { Job } from '../model/Job';
import { createSlug } from '../utils/CreateSlug';

export class CompanyController {
	static async getCompanyWithId(c) {
		const idCompany = c.req.query('id');
		const company = await Company.getCompanyWithId(c, idCompany);
		return c.json({
			success: true,
			data: company,
		});
	}
}

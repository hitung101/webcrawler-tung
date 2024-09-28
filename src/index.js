import { Hono } from 'hono';
import index from '../views/index.html';
import detail from '../views/job-detail.html';
import { JobController } from '../controller/JobController';
import { CompanyController } from '../controller/CompanyController';
import { GetProvince } from '../utils/GetProvince';

const app = new Hono();

app.get('/', (c) => {
	return c.html(index);
});
app.get('/job-show/:slug', (c) => {
	return c.html(detail);
});

// api
app.get('/api/v1/job/:slug', JobController.getJob);
app.get('/jobs', JobController.getListJob);
app.get('/company', CompanyController.getCompanyWithId);
app.get('/api/v1/province', async (c) => {
	const listProvince = await GetProvince();
	return c.json({
		status: 'success',
		data: listProvince,
	});
});
app.post('/add-job', JobController.addJob);
export default app;

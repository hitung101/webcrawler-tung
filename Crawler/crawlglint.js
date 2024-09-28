const axios = require('axios');
const fs = require('fs');
const path = require('path');

// URL bạn muốn test
const testUrl = "https://glints.com/vn/opportunities/jobs/java-developer/31182f20-78c9-4a44-a1f6-6aa2faf8e759?utm_referrer=explore&traceInfo=43e199eb-4124-40f4-b9b7-5d5670e41998";

// Thư mục để lưu dữ liệu JSON
const outputFolder = 'C:\\Users\\Tung\\Desktop\\Chuyển đổi số\\tim-viec-main\\Crawler\\JobsGlint';

// Đảm bảo thư mục tồn tại
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

async function fetchJobDetails(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;

    // Kiểm tra cấu trúc dữ liệu
    console.log('Dữ liệu:', data);

    const jobData = data.props && data.props.pageProps && data.props.pageProps.initialOpportunity;
    if (!jobData) {
      throw new Error('Cấu trúc dữ liệu không đúng');
    }

    // Trích xuất dữ liệu công việc
    const job = {
      title: jobData.title || '',
      description: jobData.descriptionJsonString
        ? JSON.parse(jobData.descriptionJsonString).blocks.map(block => block.text).join(' ')
        : '',
      url: url,
      location: jobData.city ? jobData.city.name : '',
      experience: `${jobData.minYearsOfExperience || 0} - ${jobData.maxYearsOfExperience || 0} năm` || '',
      requirement: '', // Cần xác định cách lấy yêu cầu từ dữ liệu
      salary: jobData.salaries
        ? jobData.salaries.map(salary => `${salary.minAmount} - ${salary.maxAmount} ${salary.CurrencyCode}`).join(', ')
        : '',
      expiration_date: '', // Cần xác định cách lấy expiration_date
      job_type: jobData.type || '',
      created_at: jobData.createdAt || '',
      company: jobData.company ? jobData.company.name : ''
    };

    // Lưu dữ liệu vào tệp JSON
    const fileName = path.join(outputFolder, 'jobDetails.json');
    fs.writeFileSync(fileName, JSON.stringify(job, null, 2));
    console.log(`Đã lưu dữ liệu vào ${fileName}`);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
  }
}

// Gọi hàm để kiểm tra
fetchJobDetails(testUrl);

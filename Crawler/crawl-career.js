const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Hàm tạo slug từ tiêu đề công việc (loại bỏ ký tự đặc biệt và thay thế khoảng trắng bằng dấu "-")
function createSlug(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Thay thế các ký tự không phải chữ cái hoặc số bằng dấu "-"
    .replace(/^-+|-+$/g, '');    // Loại bỏ dấu "-" ở đầu hoặc cuối
}

const baseURL = 'https://www.careerlink.vn/viec-lam/k/IT?page=';
let globalIndex = 1;

// Hàm lấy dữ liệu từ một trang
async function fetchPage(page) {
  try {
    const { data } = await axios.get(baseURL + page, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      },
      timeout: 10000 // Thời gian chờ 10 giây
    });
    return cheerio.load(data);
  } catch (error) {
    console.error(`Lỗi khi fetch trang ${page}:`, error.message);
  }
}


// Hàm crawl các job từ một trang
async function crawlJobsFromPage(page) {
  const $ = await fetchPage(page);
  const jobs = [];

  $('.list-group-item').each((index, element) => {
    const title = $(element).find('.job-link .job-name').text().trim();
    const company = $(element).find('.job-company').text().trim();
    const location = $(element).find('.job-location a').map((i, el) => $(el).text().trim()).get().join(', ');
    const salary = $(element).find('.job-salary').text().trim() || 'Thương lượng';
    const job_type = $(element).find('.job-position').text().trim() || 'Chưa xác định';
    const relativeUrl = $(element).find('.job-link').attr('href');
    const url = `https://www.careerlink.vn${relativeUrl}`;

    // Lấy ngày hết hạn từ thuộc tính data-datetime
    const expirationTimestamp = $(element).find('.cl-datetime').attr('data-datetime');
    let expiration_date = 'Chưa xác định';
    if (expirationTimestamp) {
      const date = new Date(parseInt(expirationTimestamp) * 1000);
      expiration_date = date.toISOString().split('T')[0];
    }

    const description = `Mô tả công việc: Vui lòng truy cập link ${url} để biết thêm chi tiết.`;
    const experience = "Chưa xác định"; // Placeholder
    const requirement = "Chưa xác định"; // Placeholder
    const created_at = new Date().toISOString().split('T')[0]; // Chỉ lấy ngày

    jobs.push({
      title,            // Tên công việc
      description,      // Mô tả công việc
      location,         // Địa chỉ làm việc
      experience,       // Kinh nghiệm yêu cầu
      requirement,      // Yêu cầu công việc
      salary,           // Mức lương
      expiration_date,  // Hạn đăng tuyển
      job_type,         // Loại công việc
      created_at,       // Ngày tạo
      url,              // URL dẫn đến chi tiết công việc
      company           // Tên công ty
    });
  });

  return jobs;
}

// Hàm lưu công việc vào tệp JSON
function saveJobToFile(job) {
  const dir = 'C:/Users/Tung/Desktop/Chuyển đổi số/tim-viec-main/Crawler/Crawler/Jobs1';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
  }
  const filePath = path.join(dir, `${createSlug(job.title)}-${Date.now()}.json`); // Thêm timestamp vào tên tệp
  fs.writeFileSync(filePath, JSON.stringify(job, null, 2));
  console.log(`Saved: ${filePath}`);
}

// Crawl dữ liệu từ nhiều trang
async function crawlAllJobs() {
  try {
    const totalPages = 20; // Số lượng trang cần crawl
    let allJobs = [];
    let recordNumber = 1;
    for (let page = 1; page <= totalPages; page++) {
      console.log(`Đang crawl trang ${page}...`);
      const jobs = await crawlJobsFromPage(page);
      allJobs = allJobs.concat(jobs);
      jobs.forEach((job) => {
        console.log(`STT ${recordNumber}:`);
        console.log(JSON.stringify(job, null, 2));
        saveJobToFile(job); // Lưu từng công việc vào file
        console.log('');
        recordNumber++;
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Bắt đầu crawl dữ liệu
crawlAllJobs();

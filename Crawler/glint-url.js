const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục lưu trữ
const gfolder = 'C:\\Users\\Tung\\Desktop\\Chuyển đổi số\\tim-viec-main\\Crawler\\Crawler\\';
const pages = [
  'https://glints.com/vn/job-category/computer-information-technology?page=1',
  'https://glints.com/vn/job-category/computer-information-technology?page=2',
  'https://glints.com/vn/job-category/computer-information-technology?page=3',
  'https://glints.com/vn/job-category/computer-information-technology?page=4',
  'https://glints.com/vn/job-category/computer-information-technology?page=5',
  'https://glints.com/vn/job-category/computer-information-technology?page=6',
  'https://glints.com/vn/job-category/computer-information-technology?page=7',
  'https://glints.com/vn/job-category/computer-information-technology?page=8',
  'https://glints.com/vn/job-category/computer-information-technology?page=9',
  'https://glints.com/vn/job-category/computer-information-technology?page=10',
  'https://glints.com/vn/job-category/computer-information-technology?page=11',
  'https://glints.com/vn/job-category/computer-information-technology?page=12',
  'https://glints.com/vn/job-category/computer-information-technology?page=13',
  'https://glints.com/vn/job-category/computer-information-technology?page=14',
  'https://glints.com/vn/job-category/computer-information-technology?page=15',
  'https://glints.com/vn/job-category/computer-information-technology?page=16'
];

async function fetchPage(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

async function scrapeJobLinks() {
  const jobList = [];

  for (const page of pages) {
    console.log(`Đang lấy dữ liệu từ ${page}...`);
    const html = await fetchPage(page);
    if (html) {
      const $ = cheerio.load(html);
      $('a[href^="/vn/opportunities"]').each((_, element) => {
        const href = $(element).attr('href');
        const jobUrl = `https://glints.com${href}`;
        jobList.push(jobUrl);
      });
    }
    await new Promise(resolve => setTimeout(resolve, 13000)); // Chờ 13 giây
  }

  fs.writeFileSync(path.join(gfolder, 'jobList.json'), JSON.stringify(jobList, null, 2));
  return jobList;
}

async function fetchJobDetails(url) {
  try {
    const response = await axios.get(url);
    const data = response.data; // JSON data

    // Parse JSON data to extract job details
    const job = {
      title: data.props.pageProps.initialOpportunity.title || '',
      description: JSON.parse(data.props.pageProps.initialOpportunity.descriptionJsonString).blocks.map(block => block.text).join(' ') || '',
      url: url,
      location: data.props.pageProps.initialOpportunity.city.name || '',
      experience: `${data.props.pageProps.initialOpportunity.minYearsOfExperience || 0} - ${data.props.pageProps.initialOpportunity.maxYearsOfExperience || 0} năm` || '',
      requirement: '', // Cần xác định cách lấy yêu cầu từ dữ liệu
      salary: data.props.pageProps.initialOpportunity.salaries.map(salary => `${salary.minAmount} - ${salary.maxAmount} ${salary.CurrencyCode}`).join(', ') || '',
      expiration_date: '', // Cần xác định cách lấy expiration_date
      job_type: data.props.pageProps.initialOpportunity.type || '',
      created_at: data.props.pageProps.initialOpportunity.createdAt || '',
      company: data.props.pageProps.initialOpportunity.company.name || ''
    };

    return job;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

async function scrapeJobDetailsFromList(jobList) {
  for (const jobUrl of jobList) {
    console.log(`Đang lấy dữ liệu từ ${jobUrl}...`);
    const job = await fetchJobDetails(jobUrl);
    if (job) {
      const fileName = path.join(gfolder, 'Jobs', `${path.basename(jobUrl, '.html')}.json`);
      fs.writeFileSync(fileName, JSON.stringify(job, null, 2));
    }
    await new Promise(resolve => setTimeout(resolve, 5000)); // Chờ 35 giây
  }
}

(async function main() {
  const jobList = await scrapeJobLinks();
  await scrapeJobDetailsFromList(jobList);
})();

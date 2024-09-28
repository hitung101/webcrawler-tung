document.addEventListener("alpine:init", () => {
  Alpine.data("app", () => ({
    open: false,
    data: null,
    async init() {
      const queryString = window.location.search;

      // Tạo một đối tượng URLSearchParams từ query string
      const urlParams = new URLSearchParams(queryString);

      // Lấy giá trị của các tham số
      const keyword = urlParams.get("keyword"); // "JohnDoe"
      const location = urlParams.get("location"); // "25"
      if (keyword) {
      }
      try {
        var result = await (
          await fetch("https://crawler-job.tung2003ictu.workers.dev/jobs")
        ).json();
      } catch (err) {
        console.log(err);
      }
      this.data = result.data.results;
      console.log(this.data);
    },
    toggle() {
      this.open = !this.open;
    },
  }));
});

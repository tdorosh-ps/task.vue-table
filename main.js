const app = new Vue({
  el: '#app',
  data: {
    initialSitemaps: [],
    sitemaps: [],
    showUrlFilterForm: false,
    urlFilterValue: '',
    urlFilterRadio: '',
    typeFilterValue: 'all',
    filterOnDateBy: 'submitted',
    dateFilterValue: '',
    statusFilterValue: 'all',
    //selectedSitemapsCount: 0,
    
  },
  computed: {
    sitemapsCount() {
      return this.sitemaps.length;
    },
  },
  methods: {
    async getSitemaps() {
      let url = 'https://semalt.tech/dev/api/v1/example/test/';
      let response = await fetch(url);
      if (response.ok) {
        let responseJSON = await response.json();
        let sitemaps = responseJSON.result.sitemap;
        this.initialSitemaps = sitemaps;
        this.sitemaps = sitemaps;
        return sitemaps;
      } else {
          alert(`HTTP Error: ${response.status}`)
      }
    },
    onSubmit() {
      this.sitemaps = this.initialSitemaps.filter(el => {
        if (this.urlFilterRadio === 'contains') {
          return new RegExp(`${this.urlFilterValue}`, 'i').test(el.path);
        } else if (this.urlFilterRadio === 'not-contains') {
            let isMatch = new RegExp(`${this.urlFilterValue}`, 'i').test(el.path);
            return !isMatch;
        } else if (this.urlFilterRadio === 'exact-match') {
          return new RegExp(`${this.urlFilterValue}`).test(el.path);
        }
      })
    },
    onReset() {
      this.urlFilterValue = '';
      this.urlFilterRadio = 'contains';
    },
    filterOnType(event) {
      let value = event.target.value;
      if (value === 'all') {
        this.sitemaps = this.initialSitemaps;
      } else if (value === 'index') {
        this.sitemaps = this.initialSitemaps.filter(el => {
          return el.isSitemapsIndex === true;
        });
      }
    },
    filterOnDate(event) {
      let value = event.target.value;
      if (this.filterOnDateBy === 'submitted') {
        this.sitemaps = this.initialSitemaps.filter(el => {
          let index = el.lastSubmitted.indexOf('T');
          let shortLastSubmitted = el.lastSubmitted.substring(0, index);
          return shortLastSubmitted === value;
        });
      } else if (this.filterOnDateBy === 'last-check') {
        this.sitemaps = this.initialSitemaps.filter(el => {
          let index = el.lastCheck.indexOf('T') + 1;
          let shortLastCheck = el.lastCheck.substring(0, index);
          return shortLastCheck === value;
        });
      }
    },
    filterOnStatus(event) {
      let value = event.target.value;
      if (value === 'all') {
        this.sitemaps = this.initialSitemaps;
      } else if (value === 'success') {
        this.sitemaps = this.initialSitemaps.filter(el => {
          return el.errors === 0;
        });
      } else if (value === 'couldnot-fetch') {
        this.sitemaps = this.initialSitemaps.filter(el => {
          return el.urls === 0;
        });
      } else if (value === 'errors') {
        this.sitemaps = this.initialSitemaps.filter(el => {
          return el.errors > 0;
        });
      }
    },
    removeSitemap(index) {
      this.sitemaps = this.sitemaps.filter(el => {
        return this.sitemaps.indexOf(el) !== index;
      });
    },
    recrewlSitemap() {

    },
    checkSitemap() {
      //let checkboxes = document.getElementsByName('sitemap-checkbox');
    },
    setType(sitemap) {
      if (sitemap.isSitemapsIndex) {
        return 'Sitemap index';
      } else {
        return 'Not sitemap index'
      }
    },
    setStatus(sitemap) {
      if (sitemap.errors === 0) {
        return 'Success';
      } else if (sitemap.urls === 0) {
        return 'Couldn\'t fetch';
      } else if (sitemap.errors > 0) {
        return `${sitemap.errors} errors`;
      }
    },
    getShortDate(date) {
      const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
      return new Date(date).toLocaleDateString(navigator.language || navigator.userLanguage, options);
    },
    getShortSitemapPath(str) {
      let index = str.lastIndexOf('/');
      return str.substring(index);
    },
    // setUrlFilterFormListener() {
    //   window.addEventListener('click', function(event) {
    //     if (!document.getElementById('url-filter-form').contains(event.target)) {
    //       this.showUrlFilterForm = false;
    //     }
    //   });
    // },
  },
  beforeMount() {
    this.getSitemaps();
    //this.setUrlFilterFormListener();
  },
});

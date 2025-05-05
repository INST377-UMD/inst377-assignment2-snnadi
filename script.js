
if (annyang) {
    const commands = {
      'hello': () => alert('Hello!'),
  
      'change the color to *color': color => {
        document.body.style.backgroundColor = color;
      },
  
      'navigate to *page': page => {

        window.location.href = `${page.toLowerCase()}.html`;
      },
  
      'lookup *stock': stock => {
        const input = document.getElementById('stockInput');
        if (input) {
          input.value = stock.toUpperCase();

          const sel = document.getElementById('daySelect');
          if (sel) sel.value = 30;
  
          getStockData();
        }
      },
  
      'load dog breed *breed': showBreedInfo
    };
  
    annyang.addCommands(commands);
    annyang.start();
  }
  async function loadQuote() {
    try {
      const res  = await fetch('https://zenquotes.io/api/random');
      const data = await res.json();
      const box  = document.getElementById('quote');
      if (box) box.textContent = `${data[0].q} — ${data[0].a}`;
    } catch (err) {
      console.error(err);
    }
  }
  const POLYGON_KEY = 'LUiIbHbrH0YuepI3gV2spiEB5Dp8DWU_'; 
  
  async function getStockData() {
    const input = document.getElementById('stockInput');
    if (!input) return;
  
    const rawTicker = input.value.trim().toUpperCase();
    if (!rawTicker) {
      alert('Please enter a stock ticker');
      return;
    }
  
    const daySelect = document.getElementById('daySelect');
    if (!daySelect) {
      alert('Day select element not found');
      return;
    }
    const days = Number(daySelect.value);
  
 
    const end = new Date();
    end.setDate(end.getDate() - 1); 
    const start = new Date(end);
    start.setDate(end.getDate() - days);
  
    const s = start.toISOString().split('T')[0];
    const e = end.toISOString().split('T')[0];
  
    const url = `https://api.polygon.io/v2/aggs/ticker/${rawTicker}/range/1/day/${s}/${e}` +
                `?adjusted=true&sort=asc&limit=${days}&apiKey=${POLYGON_KEY}`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log('Polygon response:', data); 
  
  
      if ((data.status !== 'OK' && data.status !== 'DELAYED') || !data.results?.length) {
        alert(`Polygon error: ${data.status} – ${data.message || 'no data found'}`);
        return;
      }
  

      if (window.stockChart?.destroy) window.stockChart.destroy();
  
      const labels = data.results.map(r => new Date(r.t).toLocaleDateString());
      const prices = data.results.map(r => r.c);
  
      const canvas = document.getElementById('stockChart');
      if (!canvas) {
        alert('Canvas not found!');
        return;
      }
  
      const ctx = canvas.getContext('2d');
  
      window.stockChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: `${rawTicker} Close`,
            data: prices,
            borderWidth: 2,
            fill: false
          }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: '#000', 
                  font: {
                    size: 14,
                    weight: 'bold'
                  }
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                ticks: {
                  color: '#333'
                },
                grid: {
                  color: 'rgba(0,0,0,0.05)'
                }
              },
              y: {
                ticks: {
                  color: '#333'
                },
                grid: {
                  color: 'rgba(0,0,0,0.05)'
                }
              }
            }
          }
          
      });
  
    } catch (err) {
      console.error(err);
      alert('Network error – check the console for details.');
    }
  }
  
  

  async function RedditStocks() {
    const today = new Date().toISOString().split('T')[0];
    const url   = `https://tradestie.com/api/v1/apps/reddit?date=2022-04-03`;
  
    try {
      const res  = await fetch(url);
      const data = await res.json();
      const top5 = data.slice(0, 5);
  
      const table = document.getElementById('redditStocksTable');
      if (!table) return;
  

      table.innerHTML = `
        <tr>
          <th>Ticker</th>
          <th>Comment Count</th>
          <th>Sentiment</th>
        </tr>
      `;
  
 
      top5.forEach(s => {
        const icon = s.sentiment.toLowerCase() === 'bullish' ? '📈' : '📉';
        const row  = document.createElement('tr');
        row.innerHTML = `
          <td><a href="https://finance.yahoo.com/quote/${s.ticker}" target="_blank">${s.ticker}</a></td>
          <td>${s.no_of_comments}</td>
          <td>${s.sentiment} ${icon}</td>
        `;
        table.appendChild(row);
      });
  
    } catch (err) {
      console.error('Error fetching Reddit stocks:', err);
    }
  }
  
  
  async function loadRandomDogs() {
    const container = document.querySelector('#dogSlider .swiper-wrapper');
    if (!container) return;
  
    try {
      const res  = await fetch('https://dog.ceo/api/breeds/image/random/10');
      const data = await res.json();
  
      container.innerHTML = '';
      data.message.forEach(url => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
  
        slide.innerHTML = `<img src="${url}" alt="Dog">`;
        container.appendChild(slide);
      });
  
    
      new Swiper('#dogSlider', {
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false }
      });
  
    } catch (err) {
      console.error('Error loading dogs:', err);
    }
  }
  
  async function loadBreedButtons() {
    const box = document.getElementById('breedButtons');
    if (!box) return;
  
    try {
      const res = await fetch('https://dogapi.dog/api/v2/breeds');
      const data = await res.json();
  
      const shuffled = data.data.sort(() => 0.5 - Math.random());
      const randomBreeds = shuffled.slice(0, 10);
  
      box.innerHTML = '';
  
      randomBreeds.forEach(breed => {
        const btn = document.createElement('button');
        btn.textContent = breed.attributes.name;
        btn.className = 'big-button';
        btn.onclick     = () => showBreedInfo(breed.attributes.name);
        box.appendChild(btn);
      });
  
    } catch (err) {
      console.error('Error loading breed buttons:', err);
    }
  }
  
  
  async function showBreedInfo(breed) {
    const panel = document.getElementById('breedInfo');
    if (!panel) return;
  
    try {
      const res  = await fetch('https://dogapi.dog/api/v2/breeds');
      const data = await res.json();
  
 
      const match = data.data.find(b =>
        b.attributes.name.toLowerCase() === breed.toLowerCase()
      );
  
      if (!match) {
        panel.textContent = 'Breed not found.';
        return;
      }
  
      const d = match.attributes;
      panel.innerHTML = `
        <h3>${d.name}</h3>
        <p>${d.description || 'No description available.'}</p>
        <p><strong>Min Life:</strong> ${d.min_life || '?'} years</p>
        <p><strong>Max Life:</strong> ${d.max_life || '?'} years</p>
      `;
    } catch (err) {
      console.error('Error loading breed info:', err);
    }
  }
  
  window.onload = () => {
    switch (document.body.id) {
      case 'HomePage':
        loadQuote();
        break;
      case 'StockPage':
        RedditStocks();
        break;
      case 'DogPage':
        loadRandomDogs();
        loadBreedButtons();
        break;
    }
  };
  
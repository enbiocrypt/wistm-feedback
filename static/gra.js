fetch('/ajax/series')
.then(x => {
  return x.json();
})
.then( datas=> {
    // Create the chart
$(document).ready(function() {
  var options = {
      chart: {
          type: 'bar',
          
      },
      tooltip: {
        style: {
          color: 'black',
          fontSize: '18px',
          pointerEvents: 'auto',
        },
        valueDecimals : 2,
         crosshairs: [true],
  
      formatter: function() {
  
        let information = ``;
        if (this.point.name)
          information = information + `⚛ <b>${this.point.description} :</b> ${this.point.name} <br>`;
  
        if (this.point.link)
          information = information + `⚛ <b>Individual review:</b> <a href="${this.point.link}" target="_blank">Click here!</a><br>`
  
        information = information + `⚛ <b>Rating:</b> <b>${this.y.toFixed(1)}</b> <br>`
        if (this.point.Fname)
          information = information + `⚛ <b>Faculty name:</b> ${this.point.Fname} <br>`
        if (this.point.Nstudents)
          information = information + `⚛ <b>Total students:</b> ${this.point.Nstudents} <br>`
        if (this.point.Spercentage)
          information = information + `⚛ <b>Sumbmission percentage:</b> ${this.point.Spercentage} %<br>`
  /*
        let information = `⚛ <b>Branch:</b> ${this.point.name} <br>
  ⚛ <b>Total Studnets:</b> ${this.point.nstudnets} <br>
  ⚛ <b>No. of Studnets Submitted:</b> ${this.point.nsubmitted} <br>
  ⚛ <b>Number of faculty:</b> ${this.point.description} <br>
  ⚛ <b>Number of faculty:</b> <a href="www.google.com" target="_blank">google</a><br>
  ⚛ <b>happyness Index:</b> 95 <br>
  ⚛ <b>Number of Sections:</b> 5 <br>`;
  */
          return information;
      }, useHTML:true,
      },
      title: {
          text: ''
      },
      xAxis: {
          type: 'category'
      },
  
      legend: {
          enabled: false
      },
  
      plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: true
              }
          }
      },
  
      series: [{
          name: 'Branch wise report',
          colorByPoint: true,
          data: datas.data
      }],

      drilldown: {
        series: datas.series,
      }
  };
console.log(options);

  $('#example').highcharts(options);
});

});

  

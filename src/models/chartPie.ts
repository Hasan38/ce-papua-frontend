export interface OptionsCountCustomerPie {
  series: any[]
  chartOptions: {
    labels: any[]

    chart: {
      height: number
      type: string
      toolbar: {
        show: boolean
      }

    }
    color: {
      pattern: any[]
      threshold: {
        values: any[]
      }
    }
    plotOptions: {
      pie: {
        startAngle: number
        endAngle: number
      }
    }
    dataLabels: {
      enabled: boolean
    }
    fill: {
      type: string
    }
    legend: object

    responsive: [
      {
        breakpoint: number
        options: {
          chart: {
            height: number
          }
          legend: {
            position: string
          }
        }
      },
    ]
  }

}

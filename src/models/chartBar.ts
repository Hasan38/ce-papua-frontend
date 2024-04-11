export interface OptionsCountCustomerBar {
  series: [{
    data: any[]
  }]
  chart: {
    type: string
    height: number
  }
  fill: {
    type: string
  }
  plotOptions: {
    bar: {
      barHeight: string
      distributed: boolean
      horizontal: boolean
      dataLabels: {
        position: string
      }
    }
  }
  color: {
    pattern: string[]
    threshold: {
      values: number[]
    }
  }
  dataLabels: {
    enabled: boolean
    textAnchor: string
    style: {
      colors: any[]
    }
    formatter: object
    offsetX: number
    dropShadow: {
      enabled: boolean
    }
  }
  stroke: {
    width: number
    colors: any[]
  }
  xaxis: {
    categories: any[]
  }
  yaxis: {
    labels: {
      show: boolean
    }
  }

  tooltip: {
    theme: string
    x: {
      show: boolean
    }
    y: {
      title: object
    }
  }
}

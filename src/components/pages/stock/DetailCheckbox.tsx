'use client'
import { useEffect, useState } from 'react'
import DetailCharts from './DetailCharts'
import SimpleCharts from './SimpleCharts'
import { socketStockCode } from '@/utils/socketStockCode'
import RealTimeChart from './RealTimeChart'
import { getSocketData } from '@/actions/stock/getSocketData'

export default function DetalCheckbox({
  data,
  stockCode,
  link,
  staticStockPrice,
}: {
  data: any
  stockCode: string
  link: string
  staticStockPrice: any
}) {
  const [detail, setDetail] = useState(false)
  // const [realTimedata, setRealTimedata] = useState<any>()

  const handleChangeDetail = () => {
    setDetail((prev) => !prev)
  }
  // let realTimedata
  // if (link === 'real-time' && socketStockCode.includes(stockCode)) {
  //   realTimedata = getSocketData(stockCode)
  // }

  return (
    <>
      <label className="flex items-center my-3 mx-10">
        <span className="text-xl">자세히 보기</span>
        <div className="relative flex items-center ml-2">
          <input
            className="mt-0"
            type="checkbox"
            id="switch"
            onChange={handleChangeDetail}
          />
          <label htmlFor="switch" className="switch_label">
            <span className="onf_btn" />
          </label>
        </div>
      </label>

      {link === 'real-time' ? (
        <RealTimeChart data={data} />
      ) : detail ? (
        <DetailCharts chartData={data} staticStockPrice={staticStockPrice} />
      ) : (
        <SimpleCharts data={data} />
      )}
    </>
  )
}

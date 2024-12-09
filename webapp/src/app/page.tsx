"use server";

import { Chart } from "@/components/chart/tempAndHumidity";
import { createClient } from "@/lib/supabase";
import WeatherCard from "@/components/card/latestTempAndHumidity";

type WeatherData = {
  created_at: string;
  temperature: number;
  humidity: number;
}[];

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: allData, error: errorAllData },
    { data: dailyData, error: errorDailyData },
  ] = await Promise.all([
    supabase
      .from("weather")
      .select("*")
      .order("created_at", { ascending: true }),
    supabase
      .from("weather_daily_with_today")
      .select("*")
      .order("created_at", { ascending: true }),
  ]);

  if (errorAllData || errorDailyData) {
    console.error(errorAllData || errorDailyData);
    return <div>Erro ao carregar dados</div>;
  }

  const latestTempAndHumidity = allData[allData.length - 1];
  const meanTempAndHumidity = dailyData[dailyData.length - 1];

  return (
    <main className="flex flex-col justify-center px-10 pt-10">
      <Chart
        chartData={allData as WeatherData}
        dailyData={dailyData as WeatherData}
      />
      <div className="flex justify-center mt-10 gap-5 flex-col md:flex-row items-center">
        <WeatherCard
          title="Última Leitura"
          humidity={latestTempAndHumidity.humidity}
          temperature={latestTempAndHumidity.temperature}
          lastUpdated={latestTempAndHumidity.created_at}
        />
        <WeatherCard
          title="Leitura média do dia"
          humidity={meanTempAndHumidity.humidity}
          temperature={meanTempAndHumidity.temperature}
          lastUpdated={latestTempAndHumidity.created_at}
        />
      </div>
    </main>
  );
}

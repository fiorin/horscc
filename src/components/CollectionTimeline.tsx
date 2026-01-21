"use client";

import { Car } from "@/types";
import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  StarIcon,
  SparklesIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";
import { RARITY_COLORS, RARITY_ICONS } from "@/lib/rarityConfig";

interface CollectionTimeline {
  acquisitions: (Car & { sortDate: Date })[];
  milestones: Milestone[];
  totalValue: number;
  rareCount: number;
  achievements: Achievement[];
}

interface Milestone {
  date: Date;
  count: number;
  title: string;
  description: string;
}

interface Achievement {
  title: string;
  description: string;
}

export function CollectionTimeline({ cars }: { cars: Car[] }) {
  const timeline = useMemo((): CollectionTimeline => {
    const ownedCars = cars.filter((c) => c.is_owned);
    
    // Sort by acquisition date
    const acquisitions = ownedCars
      .filter((c) => c.acquired_at)
      .map((c) => ({
        ...c,
        sortDate: new Date(c.acquired_at!),
      }))
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

    // Calculate milestones
    const milestones: Milestone[] = [];
    const monthCounts = new Map<string, number>();

    acquisitions.forEach((car) => {
      const key = car.sortDate.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
      });
      monthCounts.set(key, (monthCounts.get(key) || 0) + 1);
    });

    // Create milestones for months with acquisitions
    monthCounts.forEach((count, month) => {
      milestones.push({
        date: new Date(`${month} 1`),
        count,
        title: `${count} car${count > 1 ? "s" : ""} acquired`,
        description: `Added ${count} new piece${count > 1 ? "s" : ""} to collection`,
      });
    });

    // Add milestone for 25, 50, 100 cars
    [25, 50, 100].forEach((threshold) => {
      if (ownedCars.length >= threshold && !milestones.some(m => m.count === threshold)) {
        const carAtThreshold = acquisitions[threshold - 1];
        if (carAtThreshold) {
          milestones.push({
            date: carAtThreshold.sortDate,
            count: threshold,
            title: `🎉 Collection Milestone!`,
            description: `Reached ${threshold} cars!`,
          });
        }
      }
    });

    milestones.sort((a, b) => a.date.getTime() - b.date.getTime());

    const totalValue = ownedCars.reduce(
      (sum, c) => sum + (c.estimated_value || 0),
      0
    );
    const rareCount = ownedCars.filter(
      (c) => c.rarity && c.rarity === "exclusive"
    ).length;

    const achievements: Achievement[] = [];
    if (ownedCars.length >= 1)
      achievements.push({ title: "First Wheels", description: "Added your first car" });
    if (ownedCars.length >= 10)
      achievements.push({ title: "Double Digits", description: "10 cars collected" });
    if (ownedCars.length >= 25)
      achievements.push({ title: "Quarter Century", description: "25 cars collected" });
    if (ownedCars.length >= 50)
      achievements.push({ title: "Halfway Hero", description: "50 cars collected" });
    if (rareCount > 0)
      achievements.push({ title: "Exclusive Hunter", description: "Found an exclusive rarity" });

    return {
      acquisitions,
      milestones,
      totalValue,
      rareCount,
      achievements,
    };
  }, [cars]);

  const ownedCount = cars.filter((c) => c.is_owned).length;
  const wantedCount = cars.filter((c) => !c.is_owned).length;

  return (
    <div className="space-y-8 p-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#222] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <SparklesIcon className="w-5 h-5 text-yellow-400" />
            <h3 className="text-gray-400 text-sm font-semibold">Collection Size</h3>
          </div>
          <p className="text-3xl font-bold text-[#eee]">{ownedCount}</p>
          <p className="text-xs text-gray-500 mt-1">{wantedCount} wanted</p>
        </div>

        <div className="bg-[#222] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <StarIcon className="w-5 h-5 text-purple-400" />
            <h3 className="text-gray-400 text-sm font-semibold">Rare Finds</h3>
          </div>
          <p className="text-3xl font-bold text-[#eee]">{timeline.rareCount}</p>
          <p className="text-xs text-gray-500 mt-1">Exclusive ones</p>
        </div>

        <div className="bg-[#222] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
            <h3 className="text-gray-400 text-sm font-semibold">Est. Value</h3>
          </div>
          <p className="text-3xl font-bold text-[#eee]">
            ${(timeline.totalValue / 1000).toFixed(1)}k
          </p>
          <p className="text-xs text-gray-500 mt-1">Total collection</p>
        </div>

        <div className="bg-[#222] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-gray-400 text-sm font-semibold">First Car</h3>
          </div>
          <p className="text-3xl font-bold text-[#eee]">
            {timeline.acquisitions.length > 0
              ? timeline.acquisitions[0].sortDate.getFullYear()
              : "—"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Year acquired</p>
        </div>
      </div>

      {/* Timeline Section */}
      <div>
        <h2 className="text-2xl font-bold text-[#eee] mb-6">Acquisition History</h2>
        <div className="space-y-4">
          {timeline.acquisitions.length === 0 ? (
            <div className="bg-[#222] border border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-400">
                No acquisition dates recorded yet. Add dates to your cars to see timeline!
              </p>
            </div>
          ) : (
            timeline.acquisitions.map((car, index) => (
              <div
                key={car.id}
                className="flex gap-4 bg-[#222] border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors group"
              >
                {/* Timeline Marker */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  {index < timeline.acquisitions.length - 1 && (
                    <div className="w-1 h-8 bg-gray-600" />
                  )}
                </div>

                {/* Car Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/cars/${car.id}`} className="flex gap-4">
                    <div className="relative w-16 h-10 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={car.image_url || "/placeholder.jpg"}
                        alt={car.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#eee] line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {car.name}
                        </h3>
                        {car.rarity && (
                          <span
                            className={`text-lg ${
                              RARITY_COLORS[car.rarity] || "text-gray-400"
                            }`}
                            title={car.rarity}
                          >
                            {RARITY_ICONS[car.rarity] || "●"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{car.brand}</span>
                        <span>•</span>
                        <span>{car.color}</span>
                        {car.estimated_value && (
                          <>
                            <span>•</span>
                            <span className="text-green-400">
                              ${car.estimated_value}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Date */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-300">
                    {car.sortDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {car.sortDate.getFullYear()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Milestones Section */}
      {timeline.milestones.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-[#eee] mb-6">Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeline.milestones.map((milestone) => (
              <div
                key={`${milestone.date.getTime()}`}
                className="relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-4"
              >
                <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                  {milestone.count} car{milestone.count > 1 ? "s" : ""}
                </span>
                <p className="text-lg font-bold text-purple-400 mb-2">
                  {milestone.title}
                </p>
                <p className="text-sm text-gray-300 mb-3">{milestone.description}</p>
                <p className="text-xs text-gray-500">
                  {milestone.date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {timeline.achievements.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-[#eee] mb-6">Achievements</h2>
          <div className="flex flex-wrap gap-3">
            {timeline.achievements.map((a) => (
              <span
                key={a.title}
                className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-200 border border-emerald-500/30 text-sm"
                title={a.description}
              >
                {a.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

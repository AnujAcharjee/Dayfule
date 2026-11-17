"use client";

import React from "react";
import Image from "next/image";
import { Download, QrCode, Smartphone, CheckCircle, ExternalLink } from "lucide-react";
import { GithubIcon } from "./GithubIcon";

export function DownloadSection() {
  const apkDownloadUrl =
    "https://expo.dev/accounts/anujacharjee/projects/dayfule/builds/40f8bf57-db3a-47ef-8b7b-d01a68a3abe1";
  const githubReleasesUrl = "https://github.com/AnujAcharjee/Dayfule/releases";

  // Public QR code image pointing to the EAS build URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(
    apkDownloadUrl
  )}`;

  return (
    <section id="download" className="relative py-20 lg:py-32 border-t border-white/[0.06] overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#FF6D00]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent border border-white/10 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#FF6D00_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: CTA & Info */}
            <div className="md:col-span-8 flex flex-col items-start">
              {/* App Icon + Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#FF6D00]/40 shadow-[0_0_20px_rgba(255,109,0,0.3)]">
                  <Image
                    src="/icon.png"
                    alt="Dayfule"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-[#FFA800] via-[#FF6D00] to-[#FF3D00] bg-clip-text text-transparent">
                    Dayfule for Android
                  </h3>
                  <p className="text-xs text-zinc-400">Release v1.0.0 · ~28 MB APK</p>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                Ready to Take Control of Your Year?
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                Install Dayfule directly on your Android phone today. No app store fees, no telemetry, and 100% free forever.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mb-6">
                <a
                  href={apkDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6D00] via-[#FF7A00] to-[#E65100] text-white font-bold text-sm shadow-[0_0_25px_rgba(255,109,0,0.4)] hover:shadow-[0_0_35px_rgba(255,109,0,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK (Direct)</span>
                </a>

                <a
                  href={githubReleasesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 hover:text-white font-semibold text-sm border border-white/10 transition-all"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Releases</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </div>

              {/* Install steps checklist */}
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>1. Tap Download APK on your Android phone</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>2. Tap the downloaded file to install (allow Unknown Sources)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>3. Long-press home screen to pin the <strong>Dayfule Today</strong> widget!</span>
                </div>
              </div>
            </div>

            {/* Right Column: QR Code Scanner for Mobile */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
              <div className="p-2.5 rounded-xl bg-white shadow-lg mb-3">
                <Image
                  src={qrCodeUrl}
                  alt="Scan QR code to install Dayfule"
                  width={150}
                  height={150}
                  className="rounded-lg"
                  unoptimized
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1">
                <QrCode className="w-3.5 h-3.5 text-[#FF6D00]" />
                <span>Scan with Phone Camera</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Instantly opens the APK download link on your mobile device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

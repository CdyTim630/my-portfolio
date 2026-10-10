import type { PortfolioLocale } from "@/lib/portfolio-locale";
import type { Project } from "@/lib/projects";
import styles from "./ProjectArtwork.module.css";

type ArtworkKind = Project["visual"] | "radar" | "operations" | "watermap" | "nutrition" | "document" | "journal" | "problems" | "campus" | "camp" | "network" | "combat" | "tournament" | "puzzle";

const projectKinds: Record<string, ArtworkKind> = {
  employa: "employa",
  sigmile: "sigmile",
  tomybaby: "tomybaby",
  "algorithm-visualizer": "algorithms",
  "lsap-jenkins-pipeline": "delivery",
  "ntu-grade-atlas": "atlas",
  "social-media-text-mining": "pipeline",
  "internship-radar": "radar",
  "yaoshun-dashboard": "operations",
  "ntu-water-risk-map": "watermap",
  "convenience-store-meal-optimizer": "nutrition",
  "hedgedoc-pdf-export": "document",
  "city-fragments": "journal",
  "pdao-2026": "problems",
  "ntu-im-website": "campus",
  "ntu-im-orientation-2025": "camp",
  "nasa-systems-course": "network",
  "one-more-time": "combat",
  "laughing-jianghu": "tournament",
  "2048-browser-game": "puzzle",
};

function ChatResources() {
  return (
    <>
      <path className={styles.connector} d="M257 92H333V130M257 153H299V179" />
      <g className={styles.shadow}>
        <rect className={styles.paper} x="70" y="34" width="210" height="174" rx="14" />
        <path className={styles.rule} d="M70 66H280" />
        <circle className={styles.accentFill} cx="90" cy="50" r="5" />
        <path className={styles.inkLine} d="M104 50H154" />
        <rect className={styles.tint} x="89" y="83" width="135" height="37" rx="10" />
        <path className={styles.accentLine} d="M102 97H188M102 107H166" />
        <rect className={styles.soft} x="129" y="133" width="132" height="36" rx="10" />
        <path className={styles.mutedLine} d="M144 146H240M144 156H207" />
        <path className={styles.rule} d="M90 189H233" />
        <circle className={styles.accentFill} cx="251" cy="189" r="8" />
        <path className={styles.whiteLine} d="m248 189 3-3 3 3m-3-3v6" />
      </g>
      <g className={styles.shadow} transform="rotate(6 344 114)">
        <rect className={styles.paper} x="305" y="58" width="96" height="76" rx="9" />
        <rect className={styles.secondaryTint} x="317" y="70" width="22" height="22" rx="5" />
        <path className={styles.secondaryLine} d="M323 78h10m-10 6h7" />
        <path className={styles.inkLine} d="M317 107H384" />
        <path className={styles.mutedLine} d="M317 117H364" />
      </g>
      <g className={styles.shadow} transform="rotate(-5 343 179)">
        <rect className={styles.paper} x="295" y="148" width="112" height="57" rx="9" />
        <circle className={styles.secondaryTint} cx="316" cy="168" r="8" />
        <path className={styles.mutedLine} d="M334 168H390M309 189H374" />
      </g>
    </>
  );
}

function LogisticsMap() {
  return (
    <>
      <g className={styles.mapBlocks}>
        <rect x="57" y="36" width="79" height="46" rx="7" /><rect x="154" y="33" width="73" height="49" rx="7" />
        <rect x="249" y="34" width="88" height="48" rx="7" /><rect x="357" y="34" width="65" height="77" rx="7" />
        <rect x="58" y="102" width="45" height="67" rx="7" /><rect x="121" y="103" width="105" height="40" rx="7" />
        <rect x="247" y="102" width="89" height="70" rx="7" /><rect x="121" y="164" width="106" height="55" rx="7" />
        <rect x="247" y="192" width="91" height="28" rx="7" /><rect x="358" y="132" width="65" height="87" rx="7" />
        <rect x="57" y="190" width="46" height="30" rx="7" />
      </g>
      <path className={styles.routeGhost} d="M82 183H237V92H347V183H386" />
      <path className={styles.route} d="M82 183H112V92H347V183H386" />
      <path className={styles.secondaryRoute} d="M112 92H237V152H298" />
      {[[112, 92], [237, 152], [347, 92], [347, 183]].map(([x, y]) => <circle className={styles.stop} key={`${x}-${y}`} cx={x} cy={y} r="6" />)}
      <g className={styles.shadow}>
        <rect className={styles.accentFill} x="64" y="165" width="36" height="36" rx="10" />
        <path className={styles.whiteLine} d="m73 180 9-6 9 6v11H73Zm6 11v-7h6v7" />
        <rect className={styles.paper} x="367" y="166" width="37" height="35" rx="9" />
        <path className={styles.secondaryLine} d="m377 178 9-5 9 5v11l-9 5-9-5Zm9-5v21m-9-16 9 5 9-5" />
      </g>
      <path className={styles.accentFill} d="m218 87 9 5-9 5Z" />
    </>
  );
}

function Conversation() {
  const levels = [13, 27, 42, 24, 53, 37, 61, 42, 26, 46, 32, 16];
  return (
    <>
      <circle className={styles.halo} cx="240" cy="128" r="98" />
      <circle className={styles.halo} cx="240" cy="128" r="75" />
      <g className={styles.shadow} transform="rotate(-7 144 115)">
        <rect className={styles.paper} x="61" y="60" width="163" height="109" rx="15" />
        <circle className={styles.secondaryTint} cx="87" cy="86" r="11" />
        <path className={styles.mutedLine} d="M108 86H172" />
        <path className={styles.inkLine} d="M80 114H191M80 126H173M80 138H143" />
      </g>
      <g className={styles.shadow} transform="rotate(6 321 125)">
        <rect className={styles.paper} x="244" y="43" width="162" height="140" rx="15" />
        <rect className={styles.tint} x="258" y="57" width="134" height="61" rx="10" />
        <path className={styles.accentLine} d="M272 77H373M272 89H358M272 101H326" />
        <circle className={styles.secondaryTint} cx="273" cy="142" r="10" />
        <path className={styles.mutedLine} d="M291 140H373M291 150H350" />
      </g>
      <g className={styles.shadow}>
        <rect className={styles.paper} x="137" y="149" width="202" height="61" rx="30" />
        {levels.map((height, index) => <path key={index} className={index > 3 && index < 8 ? styles.accentWave : styles.softWave} d={`M${167 + index * 13} ${179 - height / 3}v${height / 1.5}`} />)}
      </g>
    </>
  );
}

function AlgorithmSteps() {
  const bars = [37, 69, 97, 52, 117, 83];
  return (
    <>
      <g className={styles.shadow}>
        <rect className={styles.paper} x="53" y="31" width="374" height="186" rx="13" />
        <path className={styles.rule} d="M53 63H427M304 63V188M53 188H427" />
        <circle className={styles.accentFill} cx="72" cy="47" r="4" />
        <path className={styles.mutedLine} d="M85 47H154" />
        {bars.map((height, index) => <rect key={index} className={index === 2 || index === 3 ? styles.accentFill : styles.tint} x={79 + index * 34} y={172 - height * 0.72} width="22" height={height * 0.72} rx="4" />)}
        <path className={styles.accentLine} d="M157 91V82H201V91m-4-4 4 4 4-4" />
        <rect className={styles.tint} x="316" y="107" width="98" height="19" rx="3" />
        <path className={styles.mutedLine} d="M320 84H393M331 95H400M332 116H391M332 137H381M320 150H395M320 161H366" />
        <path className={styles.accentFill} d="m77 199 8 4-8 4Z" />
        <path className={styles.rule} d="M103 203H363" />
        <path className={styles.accentLine} d="M103 203H212" />
        <circle className={styles.accentFill} cx="212" cy="203" r="4" />
        <path className={styles.mutedLine} d="M390 199v8m6-8v8" />
      </g>
    </>
  );
}

function Deployment() {
  return (
    <>
      <path className={styles.connector} d="M100 128H378M183 128V190H291V128" />
      <g className={styles.shadow}>
        <rect className={styles.paper} x="55" y="81" width="83" height="95" rx="12" />
        <path className={styles.accentLine} d="M86 103v39m0-20h19v-14" />
        <circle className={styles.stop} cx="86" cy="105" r="5" /><circle className={styles.stop} cx="86" cy="144" r="5" /><circle className={styles.stop} cx="105" cy="106" r="5" />
        <rect className={styles.paper} x="159" y="66" width="94" height="116" rx="12" />
        <path className={styles.secondaryLine} d="m183 100 23-12 23 12v26l-23 12-23-12Zm23-12v50m-23-38 23 12 23-12" />
        <path className={styles.mutedLine} d="M179 160H234" />
        <rect className={styles.paper} x="276" y="81" width="80" height="95" rx="12" />
        <circle className={styles.secondaryTint} cx="316" cy="120" r="22" />
        <path className={styles.secondaryLine} d="m304 119 8 8 15-16" />
        <rect className={styles.accentFill} x="378" y="103" width="48" height="48" rx="12" />
        <path className={styles.whiteLine} d="M390 116h24v18h-24Zm6 25h12m-6-7v7" />
      </g>
      <circle className={styles.stop} cx="183" cy="190" r="4" /><circle className={styles.stop} cx="291" cy="190" r="4" />
      <path className={styles.accentFill} d="m363 124 8 4-8 4Z" />
      <text className={styles.label} x="96" y="199">Commit</text><text className={styles.label} x="206" y="51">Build</text><text className={styles.label} x="316" y="199">Check</text>
    </>
  );
}

function GradeAtlas() {
  return (
    <>
      <g className={styles.shadow} transform="rotate(-5 112 141)">
        <rect className={styles.paper} x="53" y="64" width="110" height="142" rx="10" />
        <rect className={styles.tint} x="66" y="78" width="84" height="27" rx="5" />
        <path className={styles.accentLine} d="M77 91H132" />
        <path className={styles.mutedLine} d="M67 126H147M67 146H138M67 166H145M67 186H122" />
      </g>
      <g className={styles.shadow}>
        <rect className={styles.paper} x="139" y="37" width="280" height="159" rx="12" />
        <path className={styles.inkLine} d="M158 58H223" />
        <path className={styles.rule} d="M164 91H398M164 121H398M164 153H398" />
        {[25, 42, 69, 58, 90, 107, 88, 48, 29].map((height, index) => <rect key={index} className={index > 3 && index < 7 ? styles.accentFill : styles.tint} x={170 + index * 24} y={171 - height * .78} width="15" height={height * .78} rx="3" />)}
        <path className={styles.secondaryLine} d="M176 136c24 0 35-37 66-34s26-28 61-18 31 30 83 45" />
      </g>
    </>
  );
}

function ResearchFlow() {
  return (
    <>
      <path className={styles.connector} d="M149 79H189L224 123M149 122H224M149 167H189L224 123M272 123H326" />
      {[47, 93, 139].map((y, index) => (
        <g className={styles.shadow} key={y}>
          <rect className={styles.paper} x={69 + index * 5} y={y} width="85" height="38" rx="7" />
          <path className={styles.mutedLine} d={`M${82 + index * 5} ${y + 13}h58m-58 11h${40 - index * 8}`} />
        </g>
      ))}
      <g className={styles.shadow}>
        <rect className={styles.paper} x="205" y="78" width="84" height="89" rx="14" />
        <path className={styles.accentLine} d="M224 101h46l-17 21v17l-12 7v-24Z" />
        <rect className={styles.paper} x="330" y="60" width="95" height="129" rx="10" />
        <circle className={styles.tint} cx="377" cy="99" r="24" />
        <path className={styles.accentLine} d="M359 108 373 93l11 8 14-22" />
        <rect className={styles.secondaryTint} x="345" y="139" width="63" height="7" rx="3" />
        <rect className={styles.tint} x="345" y="153" width="45" height="7" rx="3" />
        <rect className={styles.soft} x="345" y="167" width="54" height="7" rx="3" />
      </g>
      <circle className={styles.stop} cx="311" cy="123" r="5" />
    </>
  );
}

function OpportunityRadar() {
  return (
    <>
      <circle className={styles.halo} cx="148" cy="127" r="83" />
      <circle className={styles.halo} cx="148" cy="127" r="57" />
      <circle className={styles.halo} cx="148" cy="127" r="30" />
      <path className={styles.tint} d="M148 127V44a83 83 0 0 1 76 50Z" />
      <path className={styles.accentLine} d="m148 127 76-33" />
      <path className={styles.connector} d="M75 127H226M148 54V200M186 91H276" />
      <circle className={styles.stop} cx="186" cy="91" r="6" />
      <circle className={styles.accentFill} cx="124" cy="153" r="4" />
      <circle className={styles.accentFill} cx="102" cy="92" r="4" />
      <g className={styles.shadow}>
        <rect className={styles.paper} x="272" y="45" width="141" height="164" rx="12" />
        <rect className={styles.soft} x="286" y="59" width="113" height="25" rx="6" />
        <circle className={styles.mutedLine} cx="298" cy="70" r="4" /><path className={styles.mutedLine} d="m301 73 3 3m9-5h61" />
        {[97, 134, 171].map((y, index) => <g key={y}>
          <rect className={index === 0 ? styles.secondaryTint : styles.tint} x="286" y={y} width="23" height="23" rx="5" />
          <path className={styles.inkLine} d={`M320 ${y + 6}h62`} />
          <path className={styles.mutedLine} d={`M320 ${y + 16}h${45 - index * 6}`} />
        </g>)}
        <path className={styles.secondaryLine} d="m292 108 4 4 7-8" />
      </g>
    </>
  );
}

function OperationsBoard() {
  return (
    <g className={styles.shadow}>
      <rect className={styles.paper} x="49" y="36" width="382" height="181" rx="12" />
      <path className={styles.rule} d="M105 36V217M105 70H431" />
      <rect className={styles.accentFill} x="64" y="52" width="25" height="25" rx="7" />
      <path className={styles.whiteLine} d="M71 69v-7m5 7V59m6 10v-5" />
      <path className={styles.mutedLine} d="M65 99H89M65 119H84M65 139H89M65 159H81" />
      <path className={styles.inkLine} d="M124 54H201" />
      <circle className={styles.secondaryTint} cx="411" cy="54" r="7" />
      {[122, 220, 318].map((x, index) => <g key={x}>
        <rect className={styles.soft} x={x} y="87" width="83" height="113" rx="6" />
        <path className={index === 2 ? styles.secondaryLine : styles.accentLine} d={`M${x + 12} 100h35`} />
        <rect className={styles.paper} x={x + 8} y="113" width="67" height="34" rx="5" />
        <path className={styles.mutedLine} d={`M${x + 17} 124h43m-43 10h28`} />
        {index !== 2 && <><rect className={styles.paper} x={x + 8} y="156" width="67" height="32" rx="5" /><path className={styles.mutedLine} d={`M${x + 17} 168h39m-39 9h24`} /></>}
        {index === 2 && <><circle className={styles.secondaryTint} cx={x + 42} cy="174" r="11" /><path className={styles.secondaryLine} d={`m${x + 37} 173 4 4 7-8`} /></>}
      </g>)}
    </g>
  );
}

function WaterRiskMap() {
  return (
    <>
      <path className={styles.paper} d="m65 65 108-29 133 31 108-27v151l-108 29-133-31-108 27Z" />
      <path className={styles.rule} d="M173 36V189M306 67V220m-226-90 74-21m38 34 94 22m40-62 68-18M107 67l18 138m81-159 43 160m112-151 14 147" />
      <path className={styles.secondaryTint} d="m91 151 57-14 74 17 16 43-67-19-71 20Z" />
      <path className={styles.routeGhost} d="m109 105 59 34 99-17 100 38" />
      <path className={styles.route} d="m109 105 58-16 56 31 44-32 100 72" />
      <circle className={styles.stop} cx="109" cy="105" r="6" /><circle className={styles.stop} cx="367" cy="160" r="6" />
      <g className={styles.shadow}>
        <rect className={styles.paper} x="300" y="28" width="85" height="60" rx="11" />
        <path className={styles.accentLine} d="M322 59h40a9 9 0 0 0-3-17 13 13 0 0 0-24-2 10 10 0 0 0-13 19m8 8-3 7m16-7-3 7m16-7-3 7" />
      </g>
      <path className={styles.secondaryLine} d="m196 148 8 14a9 9 0 1 1-16 0Z" />
    </>
  );
}

function MealOptimizer() {
  return (
    <>
      <g className={styles.shadow}>
        <rect className={styles.paper} x="59" y="53" width="125" height="148" rx="12" />
        <path className={styles.inkLine} d="M78 76H146" />
        {[102, 132, 162].map((y, index) => <g key={y}>
          <path className={styles.rule} d={`M79 ${y}h85`} />
          <path className={styles.accentLine} d={`M79 ${y}h${53 - index * 13}`} />
          <circle className={styles.stop} cx={132 - index * 13} cy={y} r="5" />
        </g>)}
        <rect className={styles.paper} x="276" y="52" width="143" height="149" rx="12" />
        <circle className={styles.tint} cx="348" cy="113" r="40" />
        <circle className={styles.paper} cx="348" cy="113" r="31" />
        <path className={styles.secondaryTint} d="M348 86a27 27 0 0 1 23 41l-23-14Z" />
        <path className={styles.accentLine} d="M348 88v25l-23 13m23-13 23 14" />
        <path className={styles.mutedLine} d="M302 175H324M336 175H358M370 175H392" />
      </g>
      <path className={styles.connector} d="M184 126H276" />
      <rect className={styles.accentFill} x="213" y="109" width="34" height="34" rx="9" />
      <path className={styles.whiteLine} d="M238 117h-14l7 9-7 9h14" />
      <text className={styles.label} x="122" y="225">Constraints</text><text className={styles.label} x="348" y="225">Meal plan</text>
    </>
  );
}

function DocumentExport() {
  return (
    <>
      <g className={styles.shadow}>
        <rect className={styles.paper} x="55" y="50" width="170" height="157" rx="11" />
        <path className={styles.rule} d="M55 79H225" />
        <path className={styles.accentLine} d="M76 65H115m-39 37h8m-4-4v8m11-4h62" />
        <path className={styles.mutedLine} d="M76 121H195M76 134H176m-100 35h115m-115 13h84" />
        <rect className={styles.tint} x="77" y="145" width="53" height="11" rx="3" />
        <path className={styles.paper} d="M298 39h74l37 37v124a10 10 0 0 1-10 10H298a10 10 0 0 1-10-10V49a10 10 0 0 1 10-10Z" />
        <path className={styles.rule} d="M372 39v27a10 10 0 0 0 10 10h27" />
        <path className={styles.inkLine} d="M307 88H367" />
        <rect className={styles.secondaryTint} x="307" y="103" width="83" height="48" rx="5" />
        <path className={styles.secondaryLine} d="m317 140 20-19 15 13 12-11 16 17" />
        <path className={styles.mutedLine} d="M307 169H387M307 182H367" />
      </g>
      <path className={styles.accentLine} d="M244 126h25m-6-6 6 6-6 6" />
      <text className={styles.label} x="140" y="230">Markdown</text><text className={styles.label} x="348" y="232">PDF</text>
    </>
  );
}

function CityJournal() {
  return (
    <>
      <g className={styles.shadow} transform="rotate(-6 162 136)">
        <rect className={styles.paper} x="74" y="58" width="187" height="155" rx="11" />
        <rect className={styles.secondaryTint} x="86" y="71" width="163" height="112" rx="7" />
        <path className={styles.whiteLine} d="m94 95 66 26 78-23m-118-20 16 95m54-95-18 95m-78-26 143 4" />
        <path className={styles.secondaryLine} d="M137 116c-15-22 22-23 9 0l-4 6Z" /><circle className={styles.secondaryLine} cx="142" cy="107" r="3" />
        <path className={styles.mutedLine} d="M88 198H176" />
      </g>
      <g className={styles.shadow}>
        <rect className={styles.paper} x="270" y="28" width="114" height="204" rx="19" />
        <path className={styles.rule} d="M309 40h36M312 221h30" />
        <rect className={styles.tint} x="283" y="56" width="88" height="84" rx="7" />
        <path className={styles.accentLine} d="M295 125V95h16v30m0-12h22V85h19v40m-58 0h67" />
        <path className={styles.mutedLine} d="M284 157H360M284 169H343" />
        <rect className={styles.secondaryTint} x="284" y="184" width="24" height="20" rx="5" /><rect className={styles.soft} x="315" y="184" width="24" height="20" rx="5" /><rect className={styles.soft} x="346" y="184" width="24" height="20" rx="5" />
      </g>
    </>
  );
}

function ContestProblems() {
  return (
    <>
      <g className={styles.shadow}>
        <rect className={styles.paper} x="62" y="38" width="133" height="176" rx="11" />
        <path className={styles.inkLine} d="M81 61H158" />
        {[83, 113, 143, 173].map((y, index) => <g key={y}>
          <rect className={styles.tint} x="80" y={y} width="21" height="21" rx="5" />
          <text className={styles.label} x="90.5" y={y + 14}>{String.fromCharCode(65 + index)}</text>
          <path className={styles.mutedLine} d={`M112 ${y + 6}h63m-63 10h44`} />
        </g>)}
      </g>
      <path className={styles.connector} d="M278 61 246 127 300 185 377 158 394 83 278 61 300 185M246 127 377 158 278 61" />
      <path className={styles.accentLine} d="m278 61 22 124 77-27 17-75" />
      {[[278, 61], [246, 127], [300, 185], [377, 158], [394, 83]].map(([x, y], index) => <g key={x}>
        <circle className={index === 0 || index === 4 ? styles.secondaryTint : styles.paper} cx={x} cy={y} r="15" />
        <circle className={styles.accentFill} cx={x} cy={y} r="4" />
      </g>)}
      <text className={styles.label} x="323" y="223">Find a path.</text>
    </>
  );
}

function CampusWebsite() {
  return (
    <g className={styles.shadow}>
      <rect className={styles.paper} x="60" y="35" width="360" height="185" rx="12" />
      <path className={styles.rule} d="M60 66H420" />
      <rect className={styles.accentFill} x="77" y="46" width="18" height="10" rx="3" />
      <path className={styles.mutedLine} d="M316 51H337M348 51H369M380 51H403" />
      <rect className={styles.tint} x="77" y="82" width="326" height="73" rx="7" />
      <path className={styles.inkLine} d="M96 105H210M96 119H185" />
      <path className={styles.accentLine} d="M98 136H136m197 5V108h52v33m-52-32 26-16 26 16m-50 32h-8m60 0h-4m-40-8v-16m12 16v-16m12 16v-16" />
      {[77, 191, 305].map((x, index) => <g key={x}>
        <rect className={index === 1 ? styles.secondaryTint : styles.soft} x={x} y="169" width="26" height="29" rx="5" />
        <path className={styles.mutedLine} d={`M${x + 36} 178h52m-52 11h38`} />
      </g>)}
    </g>
  );
}

function OrientationCamp() {
  return (
    <>
      <circle className={styles.halo} cx="193" cy="117" r="76" />
      <circle className={styles.secondaryTint} cx="253" cy="65" r="18" />
      <path className={styles.paper} d="m70 193 116-126 120 126Z" />
      <path className={styles.tint} d="m186 67 24 126H70Z" />
      <path className={styles.accentLine} d="m70 193 116-126 120 126M186 67l24 126m-79 0 32-62 47 62M63 193h251" />
      <path className={styles.secondaryLine} d="M90 123V76m-15 36 15-23 15 23m-22-17 7-14 8 14" />
      <g className={styles.shadow} transform="rotate(5 354 131)">
        <rect className={styles.paper} x="306" y="81" width="105" height="119" rx="10" />
        <path className={styles.accentLine} d="M323 99H368" />
        {[124, 147, 170].map((y, index) => <g key={y}>
          <circle className={index === 0 ? styles.accentFill : styles.tint} cx="328" cy={y} r="4" />
          <path className={styles.mutedLine} d={`M341 ${y}h${49 - index * 8}`} />
        </g>)}
      </g>
    </>
  );
}

function NetworkLab() {
  return (
    <>
      <path className={styles.connector} d="M129 115H234M286 115H369V72M286 115H369V189" />
      <g className={styles.shadow}>
        <rect className={styles.paper} x="54" y="74" width="116" height="82" rx="10" />
        <rect className={styles.soft} x="65" y="85" width="94" height="59" rx="5" />
        <path className={styles.accentLine} d="m77 102 7 6-7 6m18 0h22" />
        <path className={styles.inkLine} d="M112 156v15m-25 0h50" />
        <rect className={styles.paper} x="219" y="88" width="73" height="58" rx="10" />
        <path className={styles.accentLine} d="M233 109h45m-45 17h8m9 0h8m9 0h8" />
        {[43, 164].map((y) => <g key={y}>
          <rect className={styles.paper} x="326" y={y} width="87" height="51" rx="8" />
          <path className={styles.mutedLine} d={`M338 ${y + 15}h44m-44 17h33`} />
          <circle className={styles.accentFill} cx="398" cy={y + 32} r="3" />
        </g>)}
      </g>
      <circle className={styles.stop} cx="312" cy="115" r="4" />
      <text className={styles.label} x="112" y="197">Client</text><text className={styles.label} x="255" y="174">Network</text>
    </>
  );
}

function CombatLoop() {
  return (
    <>
      <ellipse className={styles.soft} cx="243" cy="182" rx="177" ry="24" />
      <path className={styles.halo} d="M117 155c-15-91 185-138 253-16" />
      <path className={styles.accentLine} d="m355 135 15 4 3-15M169 187h-26" />
      <path className={styles.connector} d="M200 104c34-5 53 5 79 30" />
      <g className={styles.shadow}>
        <circle className={styles.paper} cx="152" cy="109" r="13" />
        <path className={styles.accentLine} d="m150 122-4 29 24 27m-24-27-20 27m23-46 20 7 17-20m-39 11-17 10-14-7m67-11 19-22" />
        <path className={styles.paper} d="m318 102-22 14-9 47 36 18 37-17-11-45Z" />
        <path className={styles.secondaryLine} d="m318 102 5 79m-30-38 57-2m-54-25 25 18 28-15m-43-15-9-17m41 19 8-17" />
      </g>
      <path className={styles.accentLine} d="m225 120 12 14-12 14m14-23 8 9-8 9" />
      <text className={styles.label} x="160" y="216">Dodge</text><text className={styles.label} x="321" y="216">Counter</text>
    </>
  );
}

function TournamentBracket() {
  return (
    <>
      <path className={styles.connector} d="M117 66H161V104H196M117 145H161V104M284 104H319V66H365M319 104V145H365M240 131V180" />
      {[55, 134].flatMap((y) => [70, 365].map((x) => <g className={styles.shadow} key={`${x}-${y}`}>
        <rect className={styles.paper} x={x} y={y} width="47" height="40" rx="8" />
        <circle className={styles.tint} cx={x + 23.5} cy={y + 16} r="7" />
        <path className={styles.accentLine} d={`M${x + 15} ${y + 30}q8-9 17 0`} />
      </g>))}
      <g className={styles.shadow}>
        <rect className={styles.paper} x="195" y="65" width="89" height="74" rx="12" />
        <path className={styles.secondaryLine} d="M228 84h23v12a12 12 0 0 1-23 0Zm0 4h-8v4a12 12 0 0 0 12 12m19-16h8v4a12 12 0 0 1-12 12m-7 4v13m-11 0h23" />
        <rect className={styles.paper} x="176" y="180" width="128" height="36" rx="18" />
        <circle className={styles.tint} cx="196" cy="198" r="11" />
        <path className={styles.accentLine} d="M196 192v6l4 3m14-3h67" />
        <circle className={styles.stop} cx="258" cy="198" r="4" />
      </g>
    </>
  );
}

function SlidingPuzzle() {
  const values = [2, 0, 0, 0, 4, 2, 0, 0, 8, 4, 2, 0, 16, 8, 4, 2];
  return (
    <>
      <g className={styles.shadow}>
        <rect className={styles.paper} x="140" y="27" width="200" height="200" rx="14" />
        {values.map((value, index) => {
          const x = 152 + index % 4 * 46;
          const y = 39 + Math.floor(index / 4) * 46;
          return <g key={index}>
            <rect className={value >= 8 ? styles.secondaryTint : value ? styles.tint : styles.soft} x={x} y={y} width="39" height="39" rx="7" />
            {value > 0 && <text className={styles.tileNumber} x={x + 19.5} y={y + 25}>{value}</text>}
          </g>;
        })}
      </g>
      <path className={styles.accentLine} d="M96 111v37m-8-8 8 8 8-8m274-4v-28m-8 8 8-8 8 8" />
      <path className={styles.connector} d="M367 66c40 0 42 22 17 31" />
    </>
  );
}

function GeneralProject() {
  return (
    <>
      <g className={styles.shadow} transform="rotate(-7 174 125)">
        <rect className={styles.paper} x="78" y="44" width="188" height="156" rx="12" />
        <rect className={styles.tint} x="96" y="63" width="152" height="75" rx="6" />
        <path className={styles.accentLine} d="m118 117 32-29 24 18 32-24 21 19" />
        <path className={styles.mutedLine} d="M96 159H212M96 173H183" />
      </g>
      <g className={styles.shadow} transform="rotate(7 323 137)">
        <rect className={styles.paper} x="249" y="72" width="135" height="126" rx="12" />
        <rect className={styles.secondaryTint} x="267" y="91" width="39" height="39" rx="8" />
        <path className={styles.secondaryLine} d="m278 110 7 7 12-15" />
        <path className={styles.inkLine} d="M267 151H365" />
        <path className={styles.mutedLine} d="M267 165H341M267 178H355" />
      </g>
    </>
  );
}

const illustrations = {
  employa: ChatResources,
  sigmile: LogisticsMap,
  tomybaby: Conversation,
  algorithms: AlgorithmSteps,
  delivery: Deployment,
  atlas: GradeAtlas,
  pipeline: ResearchFlow,
  radar: OpportunityRadar,
  operations: OperationsBoard,
  watermap: WaterRiskMap,
  nutrition: MealOptimizer,
  document: DocumentExport,
  journal: CityJournal,
  problems: ContestProblems,
  campus: CampusWebsite,
  camp: OrientationCamp,
  network: NetworkLab,
  combat: CombatLoop,
  tournament: TournamentBracket,
  puzzle: SlidingPuzzle,
  portfolio: GeneralProject,
};

export default function ProjectArtwork({
  slug,
  visual,
  title,
  locale = "en",
}: {
  slug: string;
  visual?: Project["visual"];
  title: string;
  locale?: PortfolioLocale;
}) {
  const kind = visual && visual !== "portfolio" ? visual : projectKinds[slug] ?? "portfolio";
  const Illustration = illustrations[kind];
  const caption = locale === "zh-TW" ? "概念示意" : "Concept illustration";

  return (
    <div className={styles.artwork} data-artwork={kind} role="img" aria-label={`${title} · ${caption}`}>
      <svg viewBox="0 0 480 256" aria-hidden="true" focusable="false">
        <Illustration />
      </svg>
      <span className={styles.caption} aria-hidden="true">{caption}</span>
    </div>
  );
}

export function ProjectAwardBadge({ slug, locale }: { slug: string; locale: PortfolioLocale }) {
  if (slug !== "sigmile" && slug !== "employa") return null;
  const zh = locale === "zh-TW";
  const champion = slug === "sigmile";
  const label = champion ? (zh ? "冠軍" : "Champion") : (zh ? "亞軍" : "Runner-up");
  const detail = champion
    ? (zh ? "2026 統一企業商業競賽 · 捷盛運輸組冠軍" : "2026 Uni-President Business Competition · J-Sheng track champion")
    : (zh ? "2026 YTP 黑客松 · 青年組亞軍" : "2026 YTP Hackathon · Youth Division runner-up");
  return <span className={styles.awardBadge} data-rank={champion ? "first" : "second"} title={detail} aria-label={detail}>{label}</span>;
}

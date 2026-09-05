import { Program, ProgramExercise } from "@/lib/programGenerator";

interface ReviewExportProps {
  program: Program;
  workouts: Record<string, ProgramExercise[]>;
  onBack: () => void;
}

function priorityLabel(priorities: string[]): string {
  if (priorities.length === 0) return "None";
  return priorities.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" + ");
}

export default function ReviewExport({ program, workouts, onBack }: ReviewExportProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Review &amp; export</p>
          <h1 className="text-2xl font-bold text-ink">Your program summary</h1>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-muted uppercase tracking-wider underline underline-offset-4 hover:text-ink"
        >
          Back
        </button>
      </div>

      <dl className="grid grid-cols-2 gap-4 mb-6 border border-border-soft rounded-card bg-panel p-4">
        <div>
          <dt className="text-xs text-muted uppercase tracking-wider mb-1">Split</dt>
          <dd className="text-ink font-semibold">
            {program.split === "upper_lower_4" ? "Upper / Lower" : "Full Body"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted uppercase tracking-wider mb-1">Training days</dt>
          <dd className="text-ink font-semibold">{program.trainingDays} / week</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs text-muted uppercase tracking-wider mb-1">Priority</dt>
          <dd className="text-ink font-semibold">{priorityLabel(program.priorities)}</dd>
        </div>
      </dl>

      <div className="space-y-6 mb-8">
        {Object.entries(workouts).map(([key, exercises]) => (
          <div key={key} className="border border-border-soft rounded-card bg-panel overflow-hidden">
            <div className="px-4 py-3 border-b border-border-soft">
              <h2 className="text-ink font-semibold">{key}</h2>
            </div>
            <div className="px-4">
              {exercises.map((ex, i) => (
                <div
                  key={ex.exerciseId + i}
                  className="flex items-center justify-between py-3 border-b border-border-soft last:border-b-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-muted tabular-nums w-5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ink-2 text-sm truncate">{ex.exerciseName}</span>
                  </div>
                  <span className="text-xs text-muted tabular-nums shrink-0 ml-3">
                    {ex.sets} &times; {ex.repMin}&ndash;{ex.repMax}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled
        title="Coming soon"
        className="w-full rounded-control bg-emerald-fill/40 text-white/70 font-semibold px-6 py-3.5 cursor-not-allowed flex items-center justify-center gap-2"
      >
        Export to Google Sheets
        <span className="text-[10px] uppercase tracking-wider bg-bg/30 rounded-full px-2 py-0.5">
          Coming soon
        </span>
      </button>
    </div>
  );
}

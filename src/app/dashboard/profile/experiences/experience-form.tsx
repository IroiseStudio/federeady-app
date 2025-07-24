import { useState } from "react";
import { ExperienceInput } from "@/types/experience";

interface ExperienceFormProps {
  onSave: () => void;
  loading: boolean;
  experience: ExperienceInput;
  setExperience: (e: ExperienceInput) => void;
  formType?: "add" | "edit";
  onCancel?: () => void;
}

export function ExperienceForm({
  onSave,
  loading,
  experience,
  setExperience,
  formType = "add",
  onCancel,
}: ExperienceFormProps) {
  const [mode, setMode] = useState<"structured" | "freeform">("structured");
  const [showWarning, setShowWarning] = useState(false);

  const handleSave = () => {
    if (!experience.title || !experience.agency || !experience.summary) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }
    onSave();
  };

  return (
    <div>
      {onCancel && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex gap-4 border-b mb-4">
        <button
          onClick={() => setMode("structured")}
          className={`pb-2 px-1 border-b-2 text-sm font-medium ${
            mode === "structured"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          Structured Form
        </button>
        <button
          onClick={() => setMode("freeform")}
          className={`pb-2 px-1 border-b-2 text-sm font-medium ${
            mode === "freeform"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          Freeform (AI)
        </button>
      </div>

      {mode === "structured" ? (
        <div className="grid gap-3">
          <input
            className="input"
            placeholder="Job Title *"
            value={experience.title}
            onChange={(e) =>
              setExperience({ ...experience, title: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Agency *"
            value={experience.agency}
            onChange={(e) =>
              setExperience({ ...experience, agency: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="GS Level (optional)"
            value={experience.gs_level}
            onChange={(e) =>
              setExperience({ ...experience, gs_level: e.target.value })
            }
          />
          <textarea
            className="input min-h-[100px]"
            placeholder="Summary / Description *"
            value={experience.summary}
            onChange={(e) =>
              setExperience({ ...experience, summary: e.target.value })
            }
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-sm text-gray-700">Start Date</label>
              <input
                type="date"
                className="input"
                value={experience.start_date || ""}
                onChange={(e) =>
                  setExperience({
                    ...experience,
                    start_date: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex-1">
              <label className="text-sm text-gray-700 flex items-center justify-between">
                End Date
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="current"
                    checked={experience.current}
                    onChange={(e) =>
                      setExperience({
                        ...experience,
                        current: e.target.checked,
                        end_date: e.target.checked ? "" : experience.end_date,
                      })
                    }
                  />
                  <label htmlFor="current" className="text-sm text-gray-700">
                    Present
                  </label>
                </span>
              </label>
              {!experience.current && (
                <input
                  type="date"
                  className="input"
                  value={experience.end_date || ""}
                  onChange={(e) =>
                    setExperience({
                      ...experience,
                      end_date: e.target.value,
                    })
                  }
                />
              )}
            </div>
          </div>

          {showWarning && (
            <div className="text-sm text-red-600 flex items-center gap-2">
              ⚠️ Please fill in Title, Agency, and Description.
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-4 py-2 rounded w-full hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : formType === "edit"
              ? "Save Changes"
              : "Save Experience"}
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-600">
          <textarea
            className="input min-h-[150px]"
            placeholder="Paste a full job description or personal write-up here. This will be processed by AI later..."
            disabled
          />
          <p className="mt-2 italic text-xs text-gray-400">
            Freeform mode coming soon — it will extract job details using AI.
          </p>
        </div>
      )}
    </div>
  );
}

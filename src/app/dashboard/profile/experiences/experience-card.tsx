"use client";

import { useState } from "react";
import { Experience, ExperienceInput } from "@/types/experience";
import { supabase } from "@/lib/supabase";
import { ConfirmDialog } from "@/app/components/dialogs/confirm-dialog";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { ExperienceForm } from "./experience-form";

interface ExperienceCardProps {
  exp: Experience;
  onDelete: () => void;
  onUpdate?: () => void;
}

export function ExperienceCard({
  exp,
  onDelete,
  onUpdate,
}: ExperienceCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editedExperience, setEditedExperience] = useState<ExperienceInput>({
    title: exp.title,
    agency: exp.agency,
    gs_level: exp.gs_level || "",
    summary: exp.summary || "",
    start_date: exp.start_date || "",
    end_date: exp.end_date || "",
    current: exp.current || false,
  });

  const handleDelete = async () => {
    const { error } = await supabase
      .from("experiences")
      .delete()
      .eq("id", exp.id);
    if (!error) onDelete();
    setShowConfirm(false);
  };

  const handleUpdate = async () => {
    setLoading(true);

    const payload = {
      ...editedExperience,
      start_date: editedExperience.start_date || null,
      end_date: editedExperience.current
        ? null
        : editedExperience.end_date || null,
    };

    const { error } = await supabase
      .from("experiences")
      .update(payload)
      .eq("id", exp.id);

    if (!error) {
      setEditMode(false);
      onUpdate?.();
    } else {
      console.error("Supabase update error:", error.message);
    }

    setLoading(false);
  };

  const startDate = exp.start_date
    ? new Date(exp.start_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      })
    : "";
  const endDate = exp.current
    ? "Present"
    : exp.end_date
    ? new Date(exp.end_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      })
    : "";

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-100 mb-4">
      {editMode ? (
        <ExperienceForm
          experience={editedExperience}
          setExperience={setEditedExperience}
          onSave={handleUpdate}
          loading={loading}
          formType="edit"
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <>
          <div className="flex justify-between">
            <div>
              <h3 className="text-md font-bold text-gray-800">
                {exp.title || "Untitled Role"}{" "}
                <span className="text-gray-500 font-normal">
                  – {exp.agency}
                </span>
              </h3>
              {exp.gs_level && (
                <p className="text-sm text-gray-500 mt-1">
                  Level: {exp.gs_level}
                </p>
              )}
            </div>
            {(startDate || endDate) && (
              <div className="text-sm text-gray-500 flex items-start gap-1">
                <span role="img" aria-label="calendar">
                  📅
                </span>
                {startDate} – {endDate}
              </div>
            )}
          </div>

          {exp.summary && (
            <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
              {exp.summary}
            </p>
          )}

          <div className="flex justify-end gap-3 mt-3">
            <button
              onClick={() => setEditMode(true)}
              className="text-gray-400 hover:text-blue-600 transition cursor-pointer"
              title="Edit Experience"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="text-gray-400 hover:text-red-600 transition cursor-pointer"
              title="Delete Experience"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </>
      )}

      {showConfirm && (
        <ConfirmDialog
          title="Confirm Deletion"
          message="Are you sure you want to delete this experience? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}

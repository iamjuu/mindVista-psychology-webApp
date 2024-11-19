"use client";
import React from "react";
import { Label } from "../../ui/labal/index";
import { Input } from "../../ui/input/input";
import { cn } from "../../utils/utils";
import Swal from "sweetalert2"; // Import SweetAlert2
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react"; // Correct import statement for icons

export function SignupFormDemo() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Show a SweetAlert after the form submission
    Swal.fire({
      title: "Thank you!",
      text: "Your form has been successfully submitted.",
      icon: "success", // You can change the icon to 'error', 'warning', etc.
      confirmButtonText: "OK",
    });
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white bg-transparent">
      <h2 className="font-bold text-xl text-neutral-300 dark:text-neutral-600">
        mindVista
      </h2>
      <p className="text-neutral-800 text-sm max-w-sm mt-2 dark:text-neutral-700">
        You can ask any thing  message please
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Name</Label>
            <Input id="firstname" placeholder="Name" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="juu@.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="twitterpassword">Type your message</Label>
          <Input id="twitterpassword" placeholder="type message" type="textarea" />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-[#A57355] to-[#A57355] block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Submit&rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

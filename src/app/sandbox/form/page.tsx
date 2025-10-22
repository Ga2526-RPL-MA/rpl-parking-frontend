"use client";

import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function FormSandbox() {
  const methods = useForm();

  return (
    <main className="mx-auto min-h-screen max-w-[1200px] items-center justify-center py-20">
      <div className="flex flex-col">
        <Typography as="h1" variant="h4" weight="bold">
          Form Sandbox
        </Typography>

        <FormProvider {...methods}>
          <form className="mt-8 w-[600px] space-y-8">
            <div>
              <Typography as="h2" variant="h5" weight="bold">
                Inputs
              </Typography>

              <Input id="Test" placeholder="Ini placeholder" className="mt-4" />
            </div>

            <div>
              <Typography as="h2" variant="h5" weight="bold">
                Select
              </Typography>

              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Typography as="h2" variant="h5" weight="bold">
                Textarea
              </Typography>

              <Textarea placeholder="Enter your message here..." />
            </div>

            <div>
              <Typography as="h2" variant="h5" weight="bold">
                Checkbox
              </Typography>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium">
                  Accept terms and conditions
                </label>
              </div>
            </div>

            <div>
              <Typography as="h2" variant="h5" weight="bold">
                Radio Group
              </Typography>

              <RadioGroup defaultValue="option1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="r1" />
                  <label htmlFor="r1">Option 1</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="r2" />
                  <label htmlFor="r2">Option 2</label>
                </div>
              </RadioGroup>
            </div>
          </form>

          <Button
            className="mt-12 w-max"
            type="submit"
            onClick={() => toast.success("Form submitted!")}
          >
            Submit
          </Button>
        </FormProvider>
      </div>
    </main>
  );
}

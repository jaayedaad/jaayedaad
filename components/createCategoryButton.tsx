import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import DynamicIcon from "./dynamicIcon";
import { manualCategoryIcons as iconsArray } from "@/constants/manualCategoryIcons";
import { cn } from "@/lib/helper";
import { toast } from "sonner";
import { TManualCategoryIcons } from "@/types/types";

function CreateCategoryButton() {
  const [categoryName, setCategoryName] = useState("");
  const [icon, setIcon] = useState<TManualCategoryIcons>("shapes");
  const [open, setOpen] = useState(false);
  const [iconSelectPopoverOpen, setIconSelectPopoverOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCreateCategory = async () => {
    if (categoryName.trim().length) {
      setLoading(true);
      setDisabled(true);

      const body = {
        icon: icon,
        name: categoryName,
      };

      fetch("/api/user/manualcategories", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((res) => {
        if (res.ok) {
          setOpen(false);
          setCategoryName("");
          setIcon("shapes");
          setLoading(false);
          toast.success("Category created successfully");
        } else {
          setOpen(false);
          setCategoryName("");
          setIcon("shapes");
          setLoading(false);
          toast.error("Failed to create category");
        }
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="justify-start w-full pr-8 bg-background hover:bg-primary/10">
          <Plus className="mr-2" size={20} /> Create category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new category</DialogTitle>
          <DialogDescription>
            Create a category of your choice
          </DialogDescription>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 self-center">Category name</div>
            <Input
              value={categoryName}
              className="col-span-2"
              placeholder="Category"
              onChange={(e) => {
                if (e.target.value.trim().length) {
                  setDisabled(false);
                } else {
                  setDisabled(true);
                }
                setCategoryName(e.target.value);
              }}
            />
            <div className="col-span-1 self-center">Category icon</div>
            <div className="col-span-2 flex items-center gap-4">
              <Popover
                open={iconSelectPopoverOpen}
                onOpenChange={setIconSelectPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={iconSelectPopoverOpen}
                    className="w-full justify-between"
                  >
                    {icon
                      ? iconsArray.find((iconName) => iconName === icon)
                      : "Select icon..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Command className="h-[48vh]">
                    <CommandInput placeholder="Search icon..." />
                    <CommandEmpty>No such icon found.</CommandEmpty>
                    <CommandGroup>
                      {iconsArray.map((iconName) => (
                        <CommandItem
                          key={iconName}
                          value={iconName}
                          onSelect={() => {
                            setIcon(iconName);
                            setIconSelectPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              icon === iconName ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <DynamicIcon
                            className="h-4 w-4 mr-2"
                            name={iconName}
                          />{" "}
                          {iconName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button className="w-12" variant="secondary" size="icon">
                <DynamicIcon className="h-4 w-4" name={icon} />
              </Button>
            </div>
            <Button
              className="col-start-3"
              onClick={handleCreateCategory}
              disabled={disabled}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCategoryButton;

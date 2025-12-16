import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMemberModal({ open, onOpenChange }: AddMemberModalProps) {
  
  // Member Information State
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [departmentAddress, setDepartmentAddress] = useState("");
  const [cityAddress, setCityAddress] = useState("");
  const [employer, setEmployer] = useState("");
  const [industry, setIndustry] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [medal, setMedal] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");

  // Government Identity State
  const [workEmail, setWorkEmail] = useState("");
  const [workPhone, setWorkPhone] = useState("");
  const [city, setCity] = useState("");
  const [seniority, setSeniority] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [badgeIdType, setBadgeIdType] = useState("");
  const [dateVerified, setDateVerified] = useState<Date>();
  const [verifiedBy, setVerifiedBy] = useState("");
  const [governmentSkills, setGovernmentSkills] = useState<string[]>([]);
  const [areasOfResponsibility, setAreasOfResponsibility] = useState("");
  const [emergencyRole, setEmergencyRole] = useState("");

  const skillsList = ["Computer", "Math", "Science", "Arts", "Music", "Sports", "Leadership", "Communication"];
  
  const governmentSkillsList = [
    "Finance & Budgeting",
    "Public Safety",
    "Infrastructure",
    "Grants Management",
    "Policy Development",
    "Community Engagement",
    "Emergency Management",
    "Urban Planning",
    "Public Health",
    "IT & Technology",
    "Human Resources",
    "Legal & Compliance"
  ];

  const handleSkillToggle = (skill: string) => {
    setSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleGovernmentSkillToggle = (skill: string) => {
    setGovernmentSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Profile photo uploaded successfully");
    }
  };


  const handleSubmit = () => {
    if (!firstName || !lastName || !workEmail || !city) {
      toast.error("Please fill in all required fields: First Name, Last Name, Work Email, and City");
      return;
    }
    
    const memberData = {
      personalIdentity: {
        firstName, middleName, lastName, suffix,
        workEmail, workPhone, profilePhoto
      },
      governmentRole: {
        city, department, position, seniority, supervisor
      },
      verification: {
        badgeIdType, dateVerified, verifiedBy
      },
      skillsAndKeywords: {
        governmentSkills, areasOfResponsibility, emergencyRole,
        additionalSkills: skills
      },
      additionalInfo: {
        phoneNumber, gender, departmentAddress, cityAddress,
        description,
        social: { whatsapp, twitter, facebook, linkedin },
        medal
      }
    };

    console.log("Government Employee Data:", memberData);
    toast.success("Government employee added successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Member Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Details</h3>
              
              {/* Name Fields */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input id="middleName" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                </div>
                <div className="col-span-5 space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div className="col-span-1 space-y-2">
                  <Label htmlFor="suffix">Suffix</Label>
                  <Input id="suffix" value={suffix} onChange={(e) => setSuffix(e.target.value)} maxLength={5} placeholder="Jr." />
                </div>
              </div>

              {/* Profile Photo */}
              <div className="space-y-2">
                <Label htmlFor="profilePhoto">Profile Photo</Label>
                <Input id="profilePhoto" type="file" onChange={handleProfilePhotoUpload} accept="image/jpeg,image/png" />
                {profilePhotoPreview && (
                  <div className="mt-2">
                    <img src={profilePhotoPreview} alt="Profile Preview" className="w-32 h-32 object-cover rounded-md border" />
                  </div>
                )}
              </div>

              {/* Department and Position */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger id="department" className="w-full">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fire">Fire Department</SelectItem>
                      <SelectItem value="police">Police Department</SelectItem>
                      <SelectItem value="public-works">Public Works</SelectItem>
                      <SelectItem value="health">Health Department</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="planning">Planning & Development</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger id="position" className="w-full">
                      <SelectValue placeholder="Select Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mayor">Mayor</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="officer">Officer</SelectItem>
                      <SelectItem value="coordinator">Coordinator</SelectItem>
                      <SelectItem value="specialist">Specialist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Phone and Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Department and City Address */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departmentAddress">Department Address</Label>
                  <Input id="departmentAddress" value={departmentAddress} onChange={(e) => setDepartmentAddress(e.target.value)} placeholder="Department office address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cityAddress">City Address</Label>
                  <Input id="cityAddress" value={cityAddress} onChange={(e) => setCityAddress(e.target.value)} placeholder="City/Municipality address" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Certifications</h3>
              <div className="space-y-2">
                <Label htmlFor="medal">Medal</Label>
                <Input id="medal" value={medal} onChange={(e) => setMedal(e.target.value)} placeholder="Enter medal or certification" />
              </div>
            </div>


            {/* Work Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Work Contact Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workEmail">Work Email *</Label>
                  <Input 
                    id="workEmail" 
                    type="email" 
                    value={workEmail} 
                    onChange={(e) => setWorkEmail(e.target.value)} 
                    placeholder="employee@city.gov"
                    required 
                  />
                  <p className="text-xs text-muted-foreground">Primary contact email (government domain)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workPhone">Work Phone</Label>
                  <Input 
                    id="workPhone" 
                    type="tel" 
                    value={workPhone} 
                    onChange={(e) => setWorkPhone(e.target.value)} 
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Government Role */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Government Role</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City/Organization *</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger id="city" className="w-full">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="springfield">City of Springfield</SelectItem>
                      <SelectItem value="riverside">City of Riverside</SelectItem>
                      <SelectItem value="lakewood">City of Lakewood</SelectItem>
                      <SelectItem value="oakdale">City of Oakdale</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Immutable or changeable by admin only</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="govDepartment">Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger id="govDepartment" className="w-full">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fire">Fire Department</SelectItem>
                      <SelectItem value="police">Police Department</SelectItem>
                      <SelectItem value="public-works">Public Works</SelectItem>
                      <SelectItem value="health">Health Department</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="planning">Planning & Development</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="admin">Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="govPosition">Position/Title</Label>
                  <Input 
                    id="govPosition" 
                    value={position} 
                    onChange={(e) => setPosition(e.target.value)} 
                    placeholder="e.g., Fire Chief, City Clerk"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seniority">Seniority Level</Label>
                  <Select value={seniority} onValueChange={setSeniority}>
                    <SelectTrigger id="seniority">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elected">Elected Official</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supervisor">Supervisor (Optional)</Label>
                <Input 
                  id="supervisor" 
                  value={supervisor} 
                  onChange={(e) => setSupervisor(e.target.value)} 
                  placeholder="Enter supervisor name or ID"
                />
                <p className="text-xs text-muted-foreground">Used for organizational chart</p>
              </div>
            </div>

            {/* Government Skills & Responsibilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Government Skills & Responsibilities</h3>
              <p className="text-sm text-muted-foreground">Used for search, AI matching, and cross-city collaboration</p>
              
              <div className="space-y-3">
                <Label>Government Skills</Label>
                <div className="grid grid-cols-3 gap-3">
                  {governmentSkillsList.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`gov-${skill}`} 
                        checked={governmentSkills.includes(skill)} 
                        onCheckedChange={() => handleGovernmentSkillToggle(skill)} 
                      />
                      <Label htmlFor={`gov-${skill}`} className="cursor-pointer text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="areasOfResponsibility">Areas of Responsibility</Label>
                <Textarea 
                  id="areasOfResponsibility" 
                  value={areasOfResponsibility} 
                  onChange={(e) => setAreasOfResponsibility(e.target.value)} 
                  placeholder="Describe primary responsibilities and areas of oversight"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyRole">Emergency Roles (Optional)</Label>
                <Input 
                  id="emergencyRole" 
                  value={emergencyRole} 
                  onChange={(e) => setEmergencyRole(e.target.value)} 
                  placeholder="Role during emergencies or critical incidents"
                />
                <p className="text-xs text-muted-foreground">For emergency response coordination</p>
              </div>
            </div>

            {/* Skills & Interests */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Skills & Interests</h3>
              <div className="grid grid-cols-4 gap-4">
                {skillsList.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox id={skill} checked={skills.includes(skill)} onCheckedChange={() => handleSkillToggle(skill)} />
                    <Label htmlFor={skill} className="cursor-pointer">{skill}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Media</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input id="whatsapp" type="url" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" type="url" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" type="url" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://" />
                </div>
              </div>
            </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Add Government Employee
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
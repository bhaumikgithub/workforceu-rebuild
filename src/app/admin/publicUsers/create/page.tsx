'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { get, post } from '@/services/api';
import InputField from '@/components/ui/form/InputField';
import SelectField from '@/components/ui/form/SelectField';
import {
  emailRegex,
  phoneRegex,
  requiredMsg,
  invalidEmailMsg,
  invalidPhoneMsg,
  passwordMismatchMsg,
  minPasswordLength
} from '@/utils/validation';
import { AlertTriangle } from "lucide-react";

interface CompanyType { id: number; name: string; }
interface Timezone { id: number; name: string; utc: string; }
interface Country { id: number; name: string; }
interface City { id: number; name: string; }

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  fax: string;
  company_name: string;
  account_type: string;
  company_type_id: string;
  timezone: string;
  location_name: string;
  password: string;
  confirm_password: string;
  payment_type: string; 
  subdomain_value: string;

  full_name: string;
  address: string;
  address2: string;
  city: string;
  state_id: string;
  pincode: string;
  country_id: string;

  payment_method: string;
  card_number?: string;
  card_expiry?: string;
  card_cvv?: string;

  regular_hours: string;
  week_start_day: string;
}

interface ButtonGroupProps {
    handleCancel: () => void;
}


export default function AddPublicUserPage() {
    const router = useRouter();
    const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
    const [timezones, setTimezones] = useState<Timezone[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<{id:number; name:string}[]>([]);
    const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
    const [rootDomain, setRootDomain] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [cityInputValue, setCityInputValue] = useState("");
    const [subdomainExists, setSudomainExists] = useState<React.ReactNode>("");

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: { account_type: '1', regular_hours: '40' }
    });

    const password = watch('password');
    const selectedCountry = watch('country_id');
    const selectedState = watch('state_id');
    const cityInput = watch('city');

  // Root domain
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        if (host.includes('localhost') || host.includes('127.0.0.1') || host.includes('wfu.net')) setRootDomain('wfu.net');
        else if (host.includes('dev')) setRootDomain('workforceu.net');
        else setRootDomain('officeautomatedhub.com');
      }
    }, []);

    // Fetch master data
    useEffect(() => {
      (async () => {
        try {
          const res = await get('/api/admin/masterData');
          setCompanyTypes(res.companyTypes || []);
          setTimezones(res.timezones || []);
          setCountries(res.countries || []);
        } catch {
          toast.error("Failed to fetch master data");
        }
      })();
    }, []);

    // Fetch states
    useEffect(() => {
      if (!selectedCountry) return setStates([]);
      (async () => {
        try {
          const res = await get(`/api/admin/states?country_id=${selectedCountry}`);
          setStates(res || []);
        } catch {
          toast.error('Failed to fetch states');
        }
      })();
    }, [selectedCountry]);

    useEffect(() => {
        if (!selectedState || !cityInputValue) {
            setCitySuggestions([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
            const res = await get(`/api/admin/cities?state_id=${selectedState}&q=${cityInputValue}`);
            setCitySuggestions(res || []);
            setHighlightedIndex(-1);
            } catch {
            toast.error('Failed to fetch cities');
            }
        }, 300); // debounce

        return () => clearTimeout(timeout);
    }, [selectedState, cityInputValue]);


    // Clear selectedCity if user types again
    useEffect(() => {
        if (selectedCity && cityInput !== selectedCity.name) setSelectedCity(null);
    }, [cityInput]);

    // Arrow key navigation
    const handleCityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!citySuggestions.length) return;

        if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % citySuggestions.length);
        } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + citySuggestions.length) % citySuggestions.length);
        } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0) {
            const city = citySuggestions[highlightedIndex];
            setValue('city', city.name);
            setSelectedCity(city);
            setCitySuggestions([]);
        }
        } else if (e.key === 'Escape') {
        setCitySuggestions([]);
        }
    };

    //Check subdomain exists or not
    const handleSubdomainCheck = async (value: string) => {
    if (!value) {
        setSudomainExists("");
        return;
    }

    try {
        const res = await fetch(`/api/admin/publicUsers?subdomain=${value}`);
        const data = await res.json();
        if (data.exists) {
            setSudomainExists(
            <div className="flex items-center text-yellow-600 text-sm">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span>This subdomain already exists</span>
            </div>
            );
        } else {
            setSudomainExists("");
        }
    } catch (err) {
        console.error("Subdomain check failed", err);
    }
    };

    const onSubmit = async (data: FormData) => {
        if (data.password !== data.confirm_password) {
        toast.error(passwordMismatchMsg);
        return;
        }
        try {
        await post('/api/admin/publicUsers', data);
        toast.success('Public user added successfully!');
        router.push('/admin/publicUsers');
        } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to add user');
        }
    };

  const handleCancel = () => router.push('/admin/publicUsers');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Add New Public User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left Column */}
        <div className="space-y-4">
          <InputField label="First Name" placeholder="First Name" register={register('first_name', { required: requiredMsg('First Name') })} error={errors.first_name} />
          <InputField label="Last Name" placeholder="Last Name" register={register('last_name', { required: requiredMsg('Last Name') })} error={errors.last_name} />
          <InputField label="Email" placeholder="Email" register={register('email', { required: requiredMsg('Email'), pattern: { value: emailRegex, message: invalidEmailMsg } })} error={errors.email} />
          <InputField label="Phone" placeholder="Phone" register={register('phone', { required: requiredMsg('Phone'), pattern: { value: phoneRegex, message: invalidPhoneMsg } })} error={errors.phone} />
          <InputField label="Mobile" placeholder="Mobile" register={register('mobile', { pattern: { value: phoneRegex, message: invalidPhoneMsg } })} error={errors.mobile} />
          <InputField label="Fax" placeholder="Fax" register={register('fax')} error={errors.fax} />
          <SelectField label="Payment Type" register={register('payment_type', { required: requiredMsg('Payment Type') })}
            options={[{ value: 'CC', label: 'Credit Card' }, { value: 'other', label: 'Other' }]} error={errors.payment_type} />

          {/* Billing */}
          <div className="md:col-span-2 mt-10">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Billing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField label="Full Name" placeholder="Full Name" register={register("full_name", { required: requiredMsg("Full Name") })} error={errors.full_name} />
              </div>
              <InputField label="Address 1" placeholder="Address 1" register={register("address", { required: requiredMsg("Address") })} error={errors.address} />
              <InputField label="Address 2" placeholder="Address 2" register={register("address2")} />
              <SelectField label="Country" register={register("country_id", { required: requiredMsg("Country") })} options={[{ value: "", label: "Choose Country" }, ...countries.map(c => ({ value: c.id, label: c.name }))]} error={errors.country_id} />
              <SelectField label="State" register={register("state_id", { required: requiredMsg("State") })} options={[{ value: "", label: "Choose State" }, ...states.map(s => ({ value: s.id, label: s.name }))]} error={errors.state_id} />
              
              {/* City Auto-suggest */}
              <div className="relative md:col-span-1">
                <InputField
                    label="City"
                    placeholder="Type to search city"
                    register={register("city", { required: requiredMsg("City") })}
                    error={errors.city}
                    value={watch("city")}
                    onChange={(e) => {
                        setValue("city", e.target.value); // update RHF
                        setCityInputValue(e.target.value); // update suggestions
                        setSelectedCity(null); // clear previously selected city
                    }}
                    onKeyDown={handleCityKeyDown}
                    autoComplete="off"
                />
                {
                    citySuggestions.length > 0 && (
                        <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto mt-1 rounded shadow">
                            {citySuggestions.map((city, index) => {
                                const matchIndex = city.name.toLowerCase().indexOf(watch("city").toLowerCase());
                                const before = city.name.slice(0, matchIndex);
                                const match = city.name.slice(matchIndex, matchIndex + watch("city").length);
                                const after = city.name.slice(matchIndex + watch("city").length);

                                return (
                                <li key={city.id}
                                    className={`px-3 py-1 cursor-pointer ${index === highlightedIndex ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                    onClick={() => {
                                    setValue('city', city.name);      // update RHF value
                                    setCityInputValue(city.name);     // update suggestions state
                                    setSelectedCity(city);            // save selected city
                                    setCitySuggestions([]);           // hide suggestions
                                    }}
                                >
                                    {before}<span className="font-bold">{match}</span>{after}
                                </li>
                                );
                            })}
                        </ul>
                    )
                }
              </div>

              <InputField label="Postal Code" placeholder="Postal Code" register={register("pincode", { required: requiredMsg("Postal Code") })} error={errors.pincode} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <InputField label="Company Name" placeholder="Company Name" register={register('company_name', { required: requiredMsg('Company Name') })} error={errors.company_name} />
          <SelectField label="Company Type" register={register('company_type_id', { required: requiredMsg('Company Type') })} options={[{ value: '', label: 'Select Company Type' }, ...companyTypes.map(c => ({ value: c.id, label: c.name }))]} error={errors.company_type_id} />
          <SelectField label="Timezone" register={register('timezone', { required: requiredMsg('Timezone') })} options={[{ value: '', label: 'Select Timezone' }, ...timezones.map(t => ({ value: t.id, label: t.utc }))]} error={errors.timezone} />
          <InputField label="Location" placeholder="Location" register={register('location_name', { required: requiredMsg('Location') })} error={errors.location_name} />
          <InputField label="Password" type="password" placeholder="Password" register={register('password', { required: requiredMsg('Password'), minLength: { value: minPasswordLength, message: `Password must be at least ${minPasswordLength} characters` } })} error={errors.password} />
          <InputField label="Confirm Password" type="password" placeholder="Confirm Password" register={register('confirm_password', { required: requiredMsg('Confirm Password'), validate: value => value === password || passwordMismatchMsg })} error={errors.confirm_password} />
          <InputField
                label="Client ID"
                placeholder="Client ID"
                register={register("subdomain_value", {
                    required: requiredMsg("Client ID"),
                    pattern: {
                    value: /^[a-z0-9]+$/,
                    message: "Only lowercase letters and numbers allowed",
                    },
                    onBlur: (e) => handleSubdomainCheck(e.target.value), // check when user leaves field
                })}
                error={errors.subdomain_value}
                warning={subdomainExists}
                addon={`.${rootDomain}`}
            />
          {/* Payment */}
          <div className="md:col-span-2 mt-10">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Card Number" placeholder="Card Number" register={register("card_number")} error={errors.card_number} />
              <InputField label="Expiry Date" placeholder="MM/YY" register={register("card_expiry")} error={errors.card_expiry} />
              <InputField label="CVV" placeholder="CVV" type="password" register={register("card_cvv")} error={errors.card_cvv} />
            </div>
          </div>
        </div>

        {/* Working / Overtime */}
        <div className="md:col-span-2 mt-10">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Working / Overtime Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Regular Hours" placeholder="Regular Hours" register={register("regular_hours")}/>
            <SelectField label="Week Starts From" register={register("week_start_day", { required: requiredMsg("Week Start Day") })}
              options={[
                { value: "0", label: "Sunday" },
                { value: "1", label: "Monday" },
                { value: "2", label: "Tuesday" },
                { value: "3", label: "Wednesday" },
                { value: "4", label: "Thursday" },
                { value: "5", label: "Friday" },
                { value: "6", label: "Saturday" },
              ]}
              error={errors.week_start_day} />
          </div>
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-center gap-4 mt-6">
          <button type="submit" className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-600">Submit</button>
          <button type="button" onClick={handleCancel} className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400">Cancel</button>
        </div>

      </form>
    </div>
  );
}

'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { confirmAndDelete } from '@/utils/confirmAndDelete';

interface CompanyType { id: number; name: string; }
interface PoUser { id: number; first_name: string; last_name: string; }
interface User {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
    status: string;
    clientId: string;
    position: string;
    dateEmployed: string;
    department: string;
    payType: string;
    reimbursement: number;
    companyName: string;
    companyType: string;
    isPrimary: boolean;
    companyTypeId?: number;
    poUserId?: number;
    employeeLimit?: number;
    regularHours?: number;
    weekStartDay?: number;
}

export default function ViewAccount() {
    const { id } = useParams();
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
    const [poUsers, setPoUsers] = useState<PoUser[]>([]);
    const [selectedCompanyType, setSelectedCompanyType] = useState<number | null>(null);
    const [selectedPoUser, setSelectedPoUser] = useState<number | "">("");
    const [regularHours, setRegularHours] = useState<number>(40);
    const [weekStartDay, setWeekStartDay] = useState<number>(0);
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/api/admin/publicUsers?id=${id}`);
                const u = res.data;
                setUser(u);
                setSelectedCompanyType(u.companyTypeId || null);
                setSelectedPoUser(u.poUserId || null);

                if (u.isPrimary) {
                    const [masterRes, poUsersRes] = await Promise.all([
                        axios.get("/api/admin/masterData"),
                        axios.get(`/api/admin/publicUsers?user_type=po_user&user_id=${id}`),
                    ]);
                    setCompanyTypes(masterRes.data.companyTypes);
                    setPoUsers(poUsersRes.data.poUsers || []);
                    setRegularHours(u.regularHours ?? 40);
                    setWeekStartDay(u.weekStartDay ?? 0);
                }
            } catch (err) {
                console.error("Failed to fetch user or master data", err);
            }
        };
        if (id) fetchUser();
    }, [id]);

    if (!user) return <div className="p-6 text-center text-gray-500">Loading...</div>;

    const handleUpdateCompanyType = async () => {
        try {
            await axios.post(`/api/admin/publicUsers/${user.id}/updateBusinessType`, { companyTypeId: selectedCompanyType });
            alert("Business Type Updated");
        } catch (err) {
            console.error(err);
            alert("Failed to update");
        }
    };

    const handleUpdatePoUser = async () => {
        try {
            await axios.post(`/api/admin/publicUsers/${user.id}/updatePoUser`, { poUserId: selectedPoUser });
            alert("PO User Updated");
        } catch (err) {
            console.error(err);
            alert("Failed to update");
        }
    };

    const handleCancel = () => router.push('/admin/publicUsers');
    const handleDelete = () => {
        confirmAndDelete({
            url: `/api/admin/publicUsers?id=${user.id}`,
            name: user.firstName,
        });
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-3xl text-blue-600 mb-6">View Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Basic Info */}
                <div className="bg-white shadow rounded-lg p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-500 text-sm">First Name</p>
                            <p className="font-medium">{user.firstName}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Last Name</p>
                            <p className="font-medium">{user.lastName}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Address</p>
                            <p className="font-medium">{user.address}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Phone</p>
                            <p className="font-medium">{user.phone}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Email</p>
                            <p className="font-medium text-green-600">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Active</p>
                            <p className="font-medium">{user.status}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Client ID</p>
                            <p className="font-medium">{user.clientId}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Admin / Primary User Info */}
                <div className="bg-white shadow rounded-lg p-6 space-y-4">
                    {user.isPrimary ? (
                        <>
                            <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Admin Controls</h3>
                            {/* Business Type */}
                            <div className="flex items-center gap-2">
                                <label className="w-32 text-gray-500">Business Type:</label>
                                <select
                                    value={selectedCompanyType || ""}
                                    onChange={(e) => setSelectedCompanyType(Number(e.target.value))}
                                    className="border rounded p-2 flex-1"
                                >
                                    {companyTypes.map((ct) => (
                                        <option key={ct.id} value={ct.id}>{ct.name}</option>
                                    ))}
                                </select>
                                <button onClick={handleUpdateCompanyType} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Update</button>
                            </div>

                            {/* PO User */}
                            <div className="flex items-center gap-2">
                                <label className="w-32 text-gray-500">PO User:</label>
                                <select
                                    value={selectedPoUser}
                                    onChange={(e) => setSelectedPoUser(Number(e.target.value))}
                                    className="border rounded p-2 flex-1"
                                >
                                    {poUsers.map((pu) => (
                                        <option key={pu.id} value={pu.id}>{pu.first_name} {pu.last_name}</option>
                                    ))}
                                </select>
                                <button onClick={handleUpdatePoUser} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Update</button>
                            </div>

                            {/* Employee Limit */}
                            <div className="flex items-center gap-2">
                                <label className="w-32 text-gray-500">Employee Limit:</label>
                                <input
                                    type="number"
                                    value={user.employeeLimit || ""}
                                    onChange={(e) => { }}
                                    className="border rounded p-2 w-32"
                                />
                                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Update Limit</button>
                            </div>

                            {/* Working Hours & Week Start */}
                            <div className="flex items-center gap-2">
                                <label className="w-32 text-gray-500">Working Hours & Week Start Day</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={regularHours}
                                        onChange={(e) => setRegularHours(Number(e.target.value))}
                                        className="border rounded p-2 w-24"
                                    />
                                    <select
                                        value={weekStartDay}
                                        onChange={(e) => setWeekStartDay(Number(e.target.value))}
                                        className="border rounded p-2"
                                    >
                                        {weekDays.map((day, idx) => (
                                            <option key={idx} value={idx}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                                        Update
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Employee Info</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Position</p>
                                    <p className="font-medium">{user.position}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Date Employed</p>
                                    <p className="font-medium">{user.dateEmployed}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Department</p>
                                    <p className="font-medium">{user.department}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Pay Type</p>
                                    <p className="font-medium">{user.payType}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Reimbursement</p>
                                    <p className="font-medium">{user.reimbursement}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Company Name</p>
                                    <p className="font-medium">{user.companyName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Company Type</p>
                                    <p className="font-medium">{user.companyType}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
                {user.isPrimary ? (
                    <>
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Subscribe</button>
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Ban</button>
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Edit</button>
                        <button onClick={handleCancel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600 transition">Back</button>
                        <button onClick={handleDelete} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600 transition">Delete</button>
                    </>
                ) : (
                    <>
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Un-Ban</button>
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Edit</button>
                        <button onClick={handleCancel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Back</button>
                        <button onClick={handleDelete} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600 transition">Delete</button>
                    </>
                )}
            </div>

        </div>
    );
}

"use client";
import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";


type FormData = {
    name: string;
    email: string;
    message: string;
    subject: string;
    joinUs: boolean;
    file: File | null;
};


const ContactForm = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        subject: "",
        message: "",
        joinUs: false,
        file: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log(name, value);

        if (e.target && e.target.type === "checkbox") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: e.target.checked,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log(formData);
        setLoading(true);
        try {
            const form = new FormData();
            form.append("name", formData?.name);
            form.append("email", formData?.email);
            form.append("subject", formData?.subject); // Send subject separately

            // Format message with heading and subject
            const formattedMessage = `Query on the RF -Architect website.\n\nSubject: ${formData.subject}\n\n${formData.message}`;

            form.append("message", formattedMessage);
            form.append("join_us", String(formData?.joinUs));
            form.append("file", formData?.file ? formData?.file : "");
            const response = await fetch("https://rftechnologies-api.vercel.app/contact-us", {
                method: "POST",
                body: form,
            });
            if (response?.ok) {
                const result: any = await response?.json();
                if (result?.status == "Success") {
                    setError(false);
                    setSuccessMessage(
                        "Thank you! Your form has been successfully submitted. We will get back to you shortly.",
                    );
                    setLoading(false);
                    setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                        joinUs: false,
                        file: null,
                    });
                } else {
                    setError(true);
                    setLoading(false);
                    console.error(
                        "Form submission failed: We encountered an issue while processing your request. Please try again later !!",
                    );
                }
            } else {
                setError(true);
                setLoading(false);
                console.error(
                    "Form submission failed: We encountered an issue while processing your request. Please try again later !!",
                );
            }
        } catch (error) {
            setError(true);
            setLoading(false);
            console.error(
                "Form submission failed: We encountered an issue while processing your request. Please try again later !!",
            );
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label
                        htmlFor="name"
                        className="text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                        Name
                    </label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                        className="bg-white border-gray-200 focus:border-black h-12 rounded-xl transition-all"
                        onChange={handleInputChange}
                        value={formData.name}
                    />
                </div>
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                        Email
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        className="bg-white border-gray-200 focus:border-black h-12 rounded-xl transition-all"
                        onChange={handleInputChange}
                        value={formData.email}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="subject"
                    className="text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                    Subject
                </label>
                <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Project Inquiry"
                    required
                    className="bg-white border-gray-200 focus:border-black h-12 rounded-xl transition-all"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="message"
                    className="text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                    Message
                </label>
                <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project..."
                    className="min-h-[180px] bg-white border-gray-200 focus:border-black rounded-xl resize-none transition-all p-4"
                    required
                />
            </div>
            {successMessage && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mt-4 text-green-600"
                >
                    {successMessage}
                </motion.div>
            )}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mt-4 text-red-600"
                >
                    Something went wrong! Please try again.
                </motion.div>
            )}

            <Button
                type="submit"
                className="w-full h-14 text-lg font-medium text-white bg-black hover:bg-gray-800 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    "Send Message"
                )}
            </Button>
        </form>
    )
}

export default ContactForm
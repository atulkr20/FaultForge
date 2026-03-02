import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthSplitShell from "@/components/AuthSplitShell";

export default function SignInPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  const inputClass =
    "w-full h-[3.35rem] bg-[#07090d] border border-white/10 px-4 text-[1.02rem] text-[#d9dde2] placeholder-[#353b44] focus:outline-none focus:border-[#ff3c3c]/50 transition-colors";
  const labelClass = "text-[0.88rem] tracking-[0.18em] text-[#656b75]";

  return (
    <AuthSplitShell
      title="Sign in to your workspace"
      switchLabel="Need an account?"
      switchTo="/signup"
      switchText="Create one"
      submitLabel="Sign In ->"
      loadingLabel="Signing in..."
      loading={loading}
      onSubmit={handleSubmit}
      subtext="By continuing you agree to the Terms of Service and Privacy Policy."
    >
      <div>
        <label className={labelClass}>EMAIL ADDRESS</label>
        <input
          type="email"
          required
          placeholder="jane@company.io"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          className={`${inputClass} mt-3`}
        />
      </div>

      <div>
        <label className={labelClass}>PASSWORD</label>
        <div className="relative mt-3">
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="your password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3f454f] hover:text-[#b8bec7] transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </AuthSplitShell>
  );
}

import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { mergeClasses } from "@griffel/react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { Country, type ICountry } from "country-state-city";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";
import TopNav from "../../common/TopNav/TopNav";
import allCities from "../../data/cities.json";
import { fieldSx, useTripPlanningFormStyles } from "./tripPlanningForm.styles";

const allCountries = Country.getAllCountries();

interface CityOption {
  cityId: number;
  name: string;
}

const interestOptions = [
  "Adventure", "History", "Food", "Nature", "Nightlife",
  "Shopping", "Art & Culture", "Relaxation", "Other",
];

const steps = [
  { num: 1, label: "Trip Details" },
  { num: 2, label: "Travelers & Budget" },
  { num: 3, label: "Interests" },
];

const TripPlanningForm = () => {
  const styles = useTripPlanningFormStyles();
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState("");
  const [originCountry, setOriginCountry] = useState<ICountry | null>(null);
  const [originCity, setOriginCity] = useState<CityOption | null>(null);
  const [originCities, setOriginCities] = useState<CityOption[]>([]);
  const [country, setCountry] = useState<ICountry | null>(null);
  const [city, setCity] = useState<CityOption | null>(null);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [otherInterest, setOtherInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleBudgetChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "" || /^[0-9]+$/.test(value)) setBudget(value);
  };

  const citiesForCountry = (selectedCountry: ICountry | null) =>
    selectedCountry
      ? allCities
        .filter((item) => item.country === selectedCountry.isoCode)
        .map((item) => ({ cityId: item.cityId, name: item.name }))
      : [];

  const handleOriginCountryChange = (_event: SyntheticEvent, value: ICountry | null) => {
    setOriginCountry(value);
    setOriginCity(null);
    setOriginCities(citiesForCountry(value));
  };

  const handleCountryChange = (_event: SyntheticEvent, value: ICountry | null) => {
    setCountry(value);
    setCity(null);
    setCities(citiesForCountry(value));
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  };

  const validateCurrentStep = () => {
    setErrorMessage("");
    if (step === 1) {
      if (!originCountry || !originCity) {
        setErrorMessage("Please select an origin.");
        return false;
      }
      if (!country || !city) {
        setErrorMessage("Please select a destination.");
        return false;
      }
      if (!startDate || !endDate) {
        setErrorMessage("Please select both a start and end date.");
        return false;
      }
    }
    if (step === 2 && (!budget || Number(budget) <= 0)) {
      setErrorMessage("Please enter a valid budget greater than 0.");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (validateCurrentStep()) setStep((current) => current + 1);
  };

  const goBack = () => {
    setErrorMessage("");
    setStep((current) => Math.max(1, current - 1));
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    if (selectedInterests.length === 0) {
      setErrorMessage("Please select at least one interest.");
      return;
    }

    const tripRequest = {
      originCountry: originCountry?.name,
      originCity: originCity?.name,
      destinationCountry: country?.name,
      destinationCity: city?.name,
      startDate: startDate?.format("YYYY-MM-DD"),
      endDate: endDate?.format("YYYY-MM-DD"),
      adults,
      children,
      interests: selectedInterests,
      otherInterest: selectedInterests.includes("Other") ? otherInterest : "",
      budget,
    };

    setIsSubmitting(true);
    setGenerating(true);
    setProgress(0);

    try {
      const requestPromise = new Promise((resolve) => setTimeout(resolve, 1000));
      const progressPromise = new Promise<void>((resolve) => {
        const interval = window.setInterval(() => {
          setProgress((current) => {
            if (current >= 100) {
              window.clearInterval(interval);
              resolve();
              return 100;
            }
            return Math.min(100, current + 5);
          });
        }, 80);
      });

      await Promise.all([requestPromise, progressPromise]);
      console.log("Trip request submitted:", tripRequest);
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
      setIsSubmitting(false);
    }
  };

  if (generating) {
    return (
      <div className={mergeClasses(styles.page, styles.generatingPage)}>
        <TopNav homeLink />
        <div className={styles.generatingIcon} aria-hidden="true">✦</div>
        <div className={styles.centered}>
          <div className={styles.generatingTitle}>Creating your personalized journey...</div>
          <div className={styles.generatingText}>
            Exploring {city?.name || "your destination"} and arranging a trip around your interests.
          </div>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.progressStatus} aria-live="polite">
          {progress < 30
            ? "Discovering local highlights..."
            : progress < 60
              ? "Matching activities to your interests..."
              : progress < 85
                ? "Organizing your days..."
                : "Adding the finishing touches..."}
        </div>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.page}>
        <TopNav homeLink />
        <main className={styles.content}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              Plan your <span className={styles.gradientText}>perfect trip</span>
            </h1>
            <p className={styles.subtitle}>
              Tell us about your trip and we&apos;ll create a personalized itinerary in seconds.
            </p>
          </header>

          <div className={styles.steps}>
            {steps.map((item, index) => (
              <div
                key={item.num}
                className={mergeClasses(
                  styles.stepItem,
                  index < steps.length - 1 && styles.stepItemGrowing,
                )}
              >
                <div className={styles.stepIdentity}>
                  <div
                    className={mergeClasses(
                      styles.stepCircle,
                      step >= item.num && styles.stepCircleReached,
                      step === item.num && styles.stepCircleCurrent,
                    )}
                  >
                    {step > item.num ? "✓" : item.num}
                  </div>
                  <span
                    className={mergeClasses(
                      styles.stepLabel,
                      step >= item.num && styles.stepLabelReached,
                      step === item.num && styles.stepLabelCurrent,
                    )}
                  >
                    {item.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={mergeClasses(
                      styles.connector,
                      step > item.num && styles.connectorComplete,
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <section className={styles.card}>
            {step === 1 && (
              <div className={styles.column24}>
                <div>
                  <label className={styles.label}>Origin</label>
                  <div className={styles.grid}>
                    <Autocomplete
                      options={allCountries}
                      getOptionLabel={(option) => option.name}
                      value={originCountry}
                      onChange={handleOriginCountryChange}
                      renderInput={(params) => (
                        <TextField {...params} label="From (Country)" placeholder="e.g. Japan" sx={fieldSx} />
                      )}
                    />
                    <Autocomplete
                      options={originCities}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.cityId === value.cityId}
                      value={originCity}
                      onChange={(_event, value) => setOriginCity(value)}
                      disabled={!originCountry}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={originCountry ? "From (City)" : "Select a country first"}
                          placeholder={originCountry ? "e.g. Tokyo" : undefined}
                          sx={fieldSx}
                        />
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className={styles.label}>Destination</label>
                  <div className={styles.grid}>
                    <Autocomplete
                      options={allCountries}
                      getOptionLabel={(option) => option.name}
                      value={country}
                      onChange={handleCountryChange}
                      renderInput={(params) => (
                        <TextField {...params} label="To (Country)" placeholder="e.g. France" sx={fieldSx} />
                      )}
                    />
                    <Autocomplete
                      options={cities}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.cityId === value.cityId}
                      value={city}
                      onChange={(_event, value) => setCity(value)}
                      disabled={!country}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={country ? "To (City)" : "Select a country first"}
                          placeholder={country ? "e.g. Paris" : undefined}
                          sx={fieldSx}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className={styles.grid}>
                  <div>
                    <label className={styles.label}>Start Date</label>
                    <DatePicker
                      value={startDate}
                      onChange={setStartDate}
                      slotProps={{ textField: { fullWidth: true, sx: fieldSx } }}
                    />
                  </div>
                  <div>
                    <label className={styles.label}>End Date</label>
                    <DatePicker
                      value={endDate}
                      onChange={setEndDate}
                      minDate={startDate ?? undefined}
                      slotProps={{ textField: { fullWidth: true, sx: fieldSx } }}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.column28}>
                <div>
                  <label className={styles.label}>Adults</label>
                  <div className={styles.counterRow}>
                    <button className={styles.counterButton} onClick={() => setAdults((value) => Math.max(1, value - 1))}>−</button>
                    <span className={styles.count}>{adults}</span>
                    <button className={styles.counterButton} onClick={() => setAdults((value) => value + 1)}>+</button>
                    <span className={styles.hint}>{adults === 1 ? "1 adult" : `${adults} adults`}</span>
                  </div>
                </div>
                <div>
                  <label className={styles.label}>Children</label>
                  <div className={styles.counterRow}>
                    <button className={styles.counterButton} onClick={() => setChildren((value) => Math.max(0, value - 1))}>−</button>
                    <span className={styles.count}>{children}</span>
                    <button className={styles.counterButton} onClick={() => setChildren((value) => value + 1)}>+</button>
                    <span className={styles.hint}>{children === 0 ? "No children" : `${children} children`}</span>
                  </div>
                </div>
                <div>
                  <label className={styles.label}>Total Budget (USD)</label>
                  <TextField
                    fullWidth
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 2000"
                    value={budget}
                    onChange={handleBudgetChange}
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className={styles.interestHeader}>
                  <h3 className={styles.interestTitle}>What are you interested in?</h3>
                  <p className={styles.interestText}>
                    Select all that apply — AI will prioritize these in your itinerary.
                  </p>
                </div>
                <div className={styles.chips}>
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      className={mergeClasses(
                        styles.chip,
                        selectedInterests.includes(interest) && styles.chipActive,
                      )}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {selectedInterests.includes("Other") && (
                  <div className={styles.otherField}>
                    <TextField
                      fullWidth
                      label="Tell us your interest"
                      placeholder="e.g. Photography or local markets"
                      value={otherInterest}
                      onChange={(event) => setOtherInterest(event.target.value)}
                      sx={fieldSx}
                    />
                  </div>
                )}
                {selectedInterests.length > 0 && (
                  <div className={styles.selectionNotice}>
                    ✓ {selectedInterests.length} interest{selectedInterests.length === 1 ? "" : "s"} selected — AI will tailor your itinerary around these preferences.
                  </div>
                )}                
                <div className={styles.summary}>
                  <div className={styles.summaryTitle}>Trip Summary</div>
                  <div className={styles.summaryGrid}>
                    {[
                      ["Destination", city?.name || "—"],
                      ["Dates", startDate && endDate ? `${startDate.format("YYYY-MM-DD")} → ${endDate.format("YYYY-MM-DD")}` : "—"],
                      ["Travelers", `${adults + children} ${adults + children === 1 ? "person" : "people"}`],
                      ["Budget", budget ? `$${Number(budget).toLocaleString()}` : "—"],
                      ["Interests", `${selectedInterests.length} selected`],
                      ["Style", "Balanced"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className={styles.summaryKey}>{label}</div>
                        <div className={styles.summaryValue}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          </section>

          <div className={styles.navigation}>
            <button
              className={mergeClasses(styles.backButton, step === 1 && styles.hidden)}
              onClick={goBack}
            >
              ← Back
            </button>
            {step < steps.length ? (
              <button className={styles.primaryButton} onClick={goNext}>Continue →</button>
            ) : (
              <button
                className={mergeClasses(styles.primaryButton, styles.generateButton)}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                Generate Itinerary
              </button>
            )}
          </div>
        </main>
      </div>
    </LocalizationProvider>
  );
};

export default TripPlanningForm;

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler


def fertilizer_preprocess(single_data, model):
    df = pd.DataFrame(
        [single_data],
        columns=[
            "Temperature",
            "Humidity",
            "Moisture",
            "SoilType",
            "CropType",
            "Nitrogen",
            "Potassium",
            "Phosphorous",
        ],
    )

    encode_soil = LabelEncoder()
    encode_crop = LabelEncoder()

    df["SoilType"] = encode_soil.fit_transform(df["SoilType"])
    df["CropType"] = encode_crop.fit_transform(df["CropType"])

    ct = ColumnTransformer(
        transformers=[("encoder", OneHotEncoder(), ["SoilType", "CropType"])],
        remainder="passthrough",
    )
    X = ct.fit_transform(df)

    sc = StandardScaler()
    X = sc.fit_transform(X)

    return pd.DataFrame(X, columns=model.feature_names_in_)


fertilizer_dic = {
    "10-26-26": """The 10-26-26 (N-P-K) fertilizer has a balanced nutrient profile with a focus on phosphorus and potassium, making it ideal for root development and flowering.
    <br/> Please consider the following suggestions:

    <br/><br/>1. <i>Apply during planting or early growth stages</i> – This will provide the necessary nutrients for root establishment and early plant development.

    <br/>2. <i>Incorporate into the soil near the root zone</i> – This ensures that the nutrients are readily available to the roots, especially for row crops like maize.

    <br/>3. <i>Ensure adequate irrigation</i> – Watering after application helps dissolve the fertilizer and allows nutrients to reach the roots efficiently.

    <br/>4. <i>Conduct soil testing</i> – Before application, test the soil to confirm the need for phosphorus and potassium, ensuring balanced nutrient levels.""",
    "14-35-14": """The 14-35-14 (N-P-K) fertilizer is high in phosphorus, crucial during the early stages of plant growth.
    <br/> Please consider the following suggestions:

    <br/><br/>1. <i>Apply at planting or early vegetative stage</i> – Ideal for crops that require a strong start, such as cereals, to promote root development.

    <br/>2. <i>Use as a starter fertilizer</i> – Apply in bands a few inches away from the seeds to prevent root burn and ensure nutrient uptake.

    <br/>3. <i>Consider supplementing with a nitrogen-rich fertilizer</i> – Later in the growing season, if necessary, to maintain balanced growth.

    <br/>4. <i>Test soil phosphorus levels</i> – To avoid excessive phosphorus buildup, test the soil before application.""",
    "17-17-17": """The 17-17-17 (N-P-K) fertilizer is a balanced, all-purpose fertilizer suitable for various crops and growth stages.
    <br/> Please consider the following suggestions:

    <br/><br/>1. <i>Use throughout the growing season</i> – Suitable for application from planting to fruiting, providing balanced nutrients.

    <br/>2. <i>Apply by broadcasting or in bands</i> – This method works well for a wide range of crops, including vegetables, fruits, and grains.

    <br/>3. <i>Consider foliar feeding</i> – Dilute and apply as a foliar spray for quick nutrient absorption, especially during critical growth stages.

    <br/>4. <i>Conduct regular soil tests</i> – Monitor nutrient levels to ensure balanced soil fertility.""",
    "20-20": """The 20-20 (N-P) fertilizer is rich in nitrogen and phosphorus, ideal for early-stage growth.
    <br/> Please consider the following suggestions:

    <br/><br/>1. <i>Apply during early growth stages</i> – This will boost vegetative growth and root development.

    <br/>2. <i>Incorporate near the root zone</i> – For effective nutrient uptake, especially in phosphorus-deficient soils.

    <br/>3. <i>Supplement with potassium if needed</i> – If the soil is low in potassium, consider adding a potassium-rich fertilizer.

    <br/>4. <i>Conduct soil testing</i> – Ensure balanced nutrient levels to avoid over-application.""",
    "28-28": """The 28-28 (N-P) fertilizer is high in nitrogen and phosphorus, often used during planting.
    <br/> Please consider the following suggestions:

    <br/><br/>1. <i>Apply at planting or early vegetative stages</i> – Promotes strong root and shoot growth.

    <br/>2. <i>Place near the seeds or young plants</i> – Ensure quick root establishment and nutrient uptake.

    <br/>3. <i>Supplement with potassium as needed</i> – If your soil is deficient in potassium, add a potassium-rich fertilizer.

    <br/>4. <i>Conduct soil tests</i> – Monitor nitrogen and phosphorus levels to avoid nutrient imbalances.""",
    "DAP": """Diammonium Phosphate (DAP) is a widely used phosphorus fertilizer that also supplies nitrogen.
    <br/> Please consider the following suggestions:

    <br/><br/>1. <i>Apply as a starter fertilizer</i> – Ideal for use during planting for crops like cereals, legumes, and vegetables.

    <br/>2. <i>Place in bands or below and to the side of seeds</i> – Prevent direct contact with seeds to avoid seed burn.

    <br/>3. <i>Ensure proper irrigation</i> – Water after application to dissolve DAP and prevent ammonia volatilization.

    <br/>4. <i>Avoid in alkaline soils</i> – DAP can temporarily increase soil pH, so it's best not used in soils that are already alkaline.""",
    "Urea": """Urea is a high-nitrogen fertilizer essential for promoting vegetative growth.
    <br/> Please consider the following suggestions:

    <br/><br/>1. <i>Apply during active growth stages</i> – Particularly effective before and during the vegetative phase.

    <br/>2. <i>Incorporate into the soil</i> – To minimize nitrogen loss due to volatilization, incorporate urea into the soil or apply before rain or irrigation.

    <br/>3. <i>Monitor application rates</i> – Avoid over-application as urea can lead to nitrogen leaching or runoff.

    <br/>4. <i>Ensure proper watering</i> – Irrigate immediately after application to help urea dissolve and reduce ammonia loss.""",
}

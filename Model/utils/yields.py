import pandas as pd


def yield_preprocess(data, encoder, scaler):
    # Create a DataFrame from the input data
    df = pd.DataFrame(
        [data],
        columns=[
            "State_Name",
            "Crop_Type",
            "Crop",
            "N",
            "P",
            "K",
            "pH",
            "rainfall",
            "temperature",
            "Area_in_hectares",
        ],
    )

    # Clean and validate categorical data
    categorical_features = ["State_Name", "Crop_Type", "Crop"]
    for feature in categorical_features:
        # Ensure no empty strings or null values
        df[feature] = df[feature].astype(str).str.strip()
        if df[feature].iloc[0] == "" or df[feature].iloc[0] == "nan":
            # Provide default values
            if feature == "State_Name":
                df[feature] = "uttar pradesh"
            elif feature == "Crop_Type":
                df[feature] = "kharif"
            elif feature == "Crop":
                df[feature] = "rice"

    # Handle categorical variables with OneHotEncoding
    try:
        X_categorical = encoder.transform(df[categorical_features])
    except ValueError as e:
        # If unknown categories are found, provide more specific error information
        print(f"Encoding error: {e}")
        print(f"Input values: {df[categorical_features].iloc[0].to_dict()}")
        raise ValueError(f"Invalid categorical values provided. Please check state, crop type, and crop names.")

    # Convert the encoded categorical data to a DataFrame
    X_categorical_df = pd.DataFrame(
        X_categorical, columns=encoder.get_feature_names_out(categorical_features)
    )

    # Drop original categorical columns and concatenate encoded columns
    df = df.drop(columns=categorical_features)
    df = pd.concat([df.reset_index(drop=True), X_categorical_df.reset_index(drop=True)], axis=1)

    # Scale numerical features
    numerical_features = ["N", "P", "K", "pH", "rainfall", "temperature", "Area_in_hectares"]
    df[numerical_features] = scaler.transform(df[numerical_features])

    return df
